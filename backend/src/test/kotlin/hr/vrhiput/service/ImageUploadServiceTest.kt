package hr.vrhiput.service

import org.junit.jupiter.api.Test
import java.awt.image.BufferedImage
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue

class ImageUploadServiceTest {

    private fun png(w: Int, h: Int): ByteArray {
        val img = BufferedImage(w, h, BufferedImage.TYPE_INT_RGB)
        val out = ByteArrayOutputStream()
        ImageIO.write(img, "png", out)
        return out.toByteArray()
    }

    private fun read(bytes: ByteArray): BufferedImage = ImageIO.read(ByteArrayInputStream(bytes))

    @Test
    fun `velika slika se smanji na maxPx i cuva omjer`() {
        val out = read(ImageUploadService.resize(png(3000, 2000), 2000, 0.88))
        assertEquals(2000, out.width)
        assertEquals(1333, out.height)
    }

    @Test
    fun `portret se smanji po visini`() {
        val out = read(ImageUploadService.resize(png(2000, 4000), 600, 0.85))
        assertEquals(600, out.height)
        assertEquals(300, out.width)
    }

    @Test
    fun `mala slika se ne povecava`() {
        val out = read(ImageUploadService.resize(png(300, 200), 2000, 0.88))
        assertEquals(300, out.width)
        assertEquals(200, out.height)
    }

    @Test
    fun `izlaz je uvijek jpeg`() {
        val out = ImageUploadService.resize(png(3000, 2000), 2000, 0.88)
        assertEquals(0xFF.toByte(), out[0])
        assertEquals(0xD8.toByte(), out[1])
    }

    @Test
    fun `vec komprimiran jpeg se ne napuhava`() {
        // jpeg q40, iste dimenzije kao cilj -> rekompresija na q88 bi ga povecala
        val src = ImageUploadService.resize(png(800, 600), 800, 0.40)
        val out = ImageUploadService.resize(src, 2000, 0.88)
        assertTrue(out.size <= src.size, "original se mora zadrzati kad bi rekompresija povecala file")
    }

    private val pub = "https://pub-abc.r2.dev"

    @Test
    fun `keysFor vraca obje varijante`() {
        val ocekivano = listOf("uuid1_full.jpg", "uuid1_thumb.jpg")
        assertEquals(ocekivano, ImageUploadService.keysFor("$pub/uuid1_full.jpg", pub))
        assertEquals(ocekivano, ImageUploadService.keysFor("$pub/uuid1_thumb.jpg", pub))
    }

    @Test
    fun `keysFor ignorira tude i neispravne urlove`() {
        // vanjska slika (npr. Unsplash) — ne smijemo je pokusati brisati
        assertEquals(emptyList<String>(), ImageUploadService.keysFor("https://images.unsplash.com/foto.jpg", pub))
        // stara lokalna putanja
        assertEquals(emptyList<String>(), ImageUploadService.keysFor("/uploads/staro.png", pub))
        // nas host, ali nepoznat sufiks
        assertEquals(emptyList<String>(), ImageUploadService.keysFor("$pub/nesto.png", pub))
        // prazan publicUrl (lokalni dev bez R2 konfiguracije)
        assertEquals(emptyList<String>(), ImageUploadService.keysFor("$pub/uuid_full.jpg", ""))
        // slican prefiks ne smije proci
        assertEquals(emptyList<String>(), ImageUploadService.keysFor("https://pub-abc.r2.dev.zlo.com/x_full.jpg", pub))
    }

    @Test
    fun `neslika baca gresku`() {
        assertThrows(IllegalArgumentException::class.java) {
            ImageUploadService.resize("ovo nije slika".toByteArray(), 2000, 0.88)
        }
    }
}
