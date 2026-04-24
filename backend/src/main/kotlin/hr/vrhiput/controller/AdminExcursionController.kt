package hr.vrhiput.controller

import hr.vrhiput.dto.CreateExcursionRequest
import hr.vrhiput.dto.ExcursionDetailDto
import hr.vrhiput.service.ExcursionAdminService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/excursions")
class AdminExcursionController(private val service: ExcursionAdminService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@Valid @RequestBody req: CreateExcursionRequest): ExcursionDetailDto =
        service.create(req)

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody req: CreateExcursionRequest,
    ): ResponseEntity<ExcursionDetailDto> =
        try {
            ResponseEntity.ok(service.update(id, req))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        try {
            service.delete(id)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
}
