package hr.vrhiput.controller

import hr.vrhiput.dto.CreateGalleryRequest
import hr.vrhiput.dto.GalleryDto
import hr.vrhiput.service.GalleryService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/gallery")
class GalleryController(private val service: GalleryService) {

    @GetMapping
    fun getAll(): List<GalleryDto> = service.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<GalleryDto> =
        try { ResponseEntity.ok(service.getById(id)) }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody req: CreateGalleryRequest): GalleryDto = service.create(req)

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody req: CreateGalleryRequest): ResponseEntity<GalleryDto> =
        try { ResponseEntity.ok(service.update(id, req)) }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }

    /** Redoslijed galerija — lista id-eva u željenom poretku. */
    @PutMapping("/order")
    fun reorder(@RequestBody ids: List<Long>) {
        service.reorder(ids)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        try { service.delete(id); ResponseEntity.noContent().build() }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }
}
