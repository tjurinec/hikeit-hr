package hr.vrhiput.controller

import hr.vrhiput.service.ImageUploadService
import hr.vrhiput.service.UploadedImage
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/upload")
class UploadController(private val uploadService: ImageUploadService) {

    @PostMapping("/image")
    fun uploadImage(@RequestParam("file") file: MultipartFile): ResponseEntity<UploadedImage> {
        return try {
            ResponseEntity.ok(uploadService.upload(file))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().build()
        }
    }
}
