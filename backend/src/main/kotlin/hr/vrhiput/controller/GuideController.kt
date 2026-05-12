package hr.vrhiput.controller

import hr.vrhiput.dto.CreateGuideRequest
import hr.vrhiput.dto.GuideDto
import hr.vrhiput.service.GuideAdminService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/guides")
class GuideController(private val service: GuideAdminService) {

    @GetMapping
    fun getAll(): List<GuideDto> = service.getAll()

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody req: CreateGuideRequest): GuideDto = service.create(req)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody req: CreateGuideRequest,
    ): ResponseEntity<GuideDto> =
        try { ResponseEntity.ok(service.update(id, req)) }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        try { service.delete(id); ResponseEntity.noContent().build() }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }
}
