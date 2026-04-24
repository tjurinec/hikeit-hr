package hr.vrhiput.controller

import hr.vrhiput.service.ImageUploadService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

data class UploadResponse(val url: String)

@RestController
@RequestMapping("/api/upload")
class UploadController(private val uploadService: ImageUploadService) {

    @PostMapping("/image")
    fun uploadImage(@RequestParam("file") file: MultipartFile): ResponseEntity<UploadResponse> {
        return try {
            val url = uploadService.upload(file)
            ResponseEntity.ok(UploadResponse(url))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        }
    }
}
