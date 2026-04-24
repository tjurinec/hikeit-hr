package hr.vrhiput.controller

import hr.vrhiput.dto.ExcursionDetailDto
import hr.vrhiput.dto.ExcursionSummaryDto
import hr.vrhiput.service.ExcursionService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/excursions")
class ExcursionController(private val service: ExcursionService) {

    @GetMapping
    fun getAll(@RequestParam(required = false) q: String?): List<ExcursionSummaryDto> =
        if (q.isNullOrBlank()) service.getAll() else service.search(q)

    @GetMapping("/featured")
    fun getFeatured(): List<ExcursionSummaryDto> = service.getFeatured()

    @GetMapping("/{slug}")
    fun getBySlug(@PathVariable slug: String): ResponseEntity<ExcursionDetailDto> =
        try {
            ResponseEntity.ok(service.getBySlug(slug))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
}
