package hr.vrhiput.controller

import hr.vrhiput.dto.GalleryImageDto
import hr.vrhiput.service.GalleryService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/gallery")
class GalleryController(private val service: GalleryService) {

    @GetMapping
    fun getAll(@RequestParam(required = false) category: String?): List<GalleryImageDto> =
        if (category.isNullOrBlank()) service.getAll() else service.getByCategory(category)
}
