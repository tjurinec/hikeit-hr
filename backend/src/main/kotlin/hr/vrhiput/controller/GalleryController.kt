package hr.vrhiput.controller

import hr.vrhiput.dto.CreateGalleryImageRequest
import hr.vrhiput.dto.GalleryImageDto
import hr.vrhiput.service.GalleryService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/gallery")
class GalleryController(private val service: GalleryService) {

    @GetMapping
    fun getAll(@RequestParam(required = false) category: String?): List<GalleryImageDto> =
        if (category.isNullOrBlank()) service.getAll() else service.getByCategory(category)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody req: CreateGalleryImageRequest): GalleryImageDto = service.create(req)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody req: CreateGalleryImageRequest,
    ): ResponseEntity<GalleryImageDto> =
        try { ResponseEntity.ok(service.update(id, req)) }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        try { service.delete(id); ResponseEntity.noContent().build() }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }
}
