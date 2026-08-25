package hr.vrhiput.service

import net.coobird.thumbnailator.Thumbnails
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.util.UUID
import javax.imageio.ImageIO

data class UploadedImage(val url: String, val thumbUrl: String)

@Service
class ImageUploadService(private val s3: S3Client) {

    @Value("\${app.r2.bucket}")
    private lateinit var bucket: String

    @Value("\${app.r2.public-url}")
    private lateinit var publicUrl: String

    private val allowed = setOf("image/jpeg", "image/png", "image/webp")

    fun upload(file: MultipartFile): UploadedImage {
        val contentType = file.contentType ?: throw IllegalArgumentException("Nepoznat tip datoteke")
        if (contentType !in allowed) throw IllegalArgumentException("Dozvoljeni formati: JPG, PNG, WEBP")
        if (file.size > MAX_BYTES) throw IllegalArgumentException("Maksimalna veličina datoteke je 20 MB")

        val bytes = file.bytes
        val id = UUID.randomUUID().toString()

        put("$id$FULL", resize(bytes, FULL_PX, FULL_QUALITY))
        put("$id$THUMB", resize(bytes, THUMB_PX, THUMB_QUALITY))

        return UploadedImage(url = "$publicUrl/$id$FULL", thumbUrl = "$publicUrl/$id$THUMB")
    }

    /** Briše obje varijante slike. Vanjske URL-ove (npr. Unsplash) ignorira. */
    fun delete(url: String) {
        keysFor(url, publicUrl).forEach { key ->
            s3.deleteObject { it.bucket(bucket).key(key) }
        }
    }

    private fun put(key: String, data: ByteArray) {
        s3.putObject(
            PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("image/jpeg")
                .cacheControl("public, max-age=31536000, immutable")
                .build(),
            RequestBody.fromBytes(data),
        )
    }

    companion object {
        /**
         * Skalira tako da duža stranica bude najviše maxPx, čuvajući omjer.
         * Manje slike se NE povećavaju (Thumbnailator.size() bi ih inače napuhao).
         */
        fun resize(bytes: ByteArray, maxPx: Int, quality: Double): ByteArray {
            val scale = minOf(1.0, maxPx.toDouble() / longerSide(bytes))
            val out = ByteArrayOutputStream()
            Thumbnails.of(ByteArrayInputStream(bytes))
                .scale(scale)
                .imageType(BufferedImage.TYPE_INT_RGB) // ponytail: prozirni PNG dobiva crnu pozadinu; ravnaj na bijelo ako zatreba
                .outputFormat("jpg")
                .outputQuality(quality)
                .toOutputStream(out)

            // Već komprimiran JPEG koji se ne skalira: rekompresija bi ga samo napuhala i degradirala.
            return if (scale == 1.0 && isJpeg(bytes) && out.size() >= bytes.size) bytes else out.toByteArray()
        }

        private fun isJpeg(b: ByteArray) =
            b.size > 2 && b[0] == 0xFF.toByte() && b[1] == 0xD8.toByte()

        /** Duža stranica iz headera, bez dekodiranja cijele slike. Invarijantna na EXIF rotaciju. */
        private fun longerSide(bytes: ByteArray): Int =
            ImageIO.createImageInputStream(ByteArrayInputStream(bytes)).use { iis ->
                val readers = ImageIO.getImageReaders(iis)
                if (!readers.hasNext()) throw IllegalArgumentException("Datoteka nije valjana slika")
                val reader = readers.next()
                try {
                    reader.input = iis
                    maxOf(reader.getWidth(0), reader.getHeight(0))
                } finally {
                    reader.dispose()
                }
            }

        /**
         * Ključevi obiju varijanti za dani javni URL.
         * Prazna lista ako URL nije naš — tada nema što brisati.
         */
        fun keysFor(url: String, publicUrl: String): List<String> {
            if (publicUrl.isBlank() || !url.startsWith("$publicUrl/")) return emptyList()
            val name = url.removePrefix("$publicUrl/")
            if (name.isBlank() || name.contains('/')) return emptyList()
            val base = name.removeSuffix(FULL).removeSuffix(THUMB)
            if (base == name) return emptyList() // nepoznat sufiks, ne diraj
            return listOf("$base$FULL", "$base$THUMB")
        }

        const val MAX_BYTES = 20L * 1024 * 1024 // mora pratiti spring.servlet.multipart.max-file-size
        const val FULL = "_full.jpg"
        const val THUMB = "_thumb.jpg"
        const val FULL_PX = 2000
        const val THUMB_PX = 600
        const val FULL_QUALITY = 0.88
        const val THUMB_QUALITY = 0.85
    }
}
