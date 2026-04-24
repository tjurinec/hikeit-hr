package hr.vrhiput.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.util.UUID

@Service
class ImageUploadService {

    @Value("\${app.upload-dir}")
    private lateinit var uploadDir: String

    private val allowed = setOf("image/jpeg", "image/png", "image/webp")

    fun upload(file: MultipartFile): String {
        val contentType = file.contentType ?: throw IllegalArgumentException("Nepoznat tip datoteke")
        if (contentType !in allowed) throw IllegalArgumentException("Dozvoljeni formati: JPG, PNG, WEBP")
        if (file.size > 20 * 1024 * 1024) throw IllegalArgumentException("Maksimalna veličina datoteke je 20 MB")

        val ext = file.originalFilename?.substringAfterLast('.', "jpg") ?: "jpg"
        val filename = "${UUID.randomUUID()}.$ext"

        val dir = Paths.get(uploadDir)
        Files.createDirectories(dir)
        file.transferTo(dir.resolve(filename).toFile())

        return "/uploads/$filename"
    }
}
