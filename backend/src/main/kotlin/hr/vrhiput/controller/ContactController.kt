package hr.vrhiput.controller

import hr.vrhiput.dto.ContactMessageDto
import hr.vrhiput.dto.CreateContactMessageRequest
import hr.vrhiput.service.ContactService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/contact")
class ContactController(private val service: ContactService) {

    /** Javno — slanje upita s kontakt forme. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun send(@Valid @RequestBody req: CreateContactMessageRequest) {
        service.create(req)
    }

    @GetMapping
    fun getAll(): List<ContactMessageDto> = service.getAll()

    @PutMapping("/{id}/handled")
    fun setHandled(
        @PathVariable id: Long,
        @RequestParam handled: Boolean,
    ): ResponseEntity<ContactMessageDto> =
        try { ResponseEntity.ok(service.setHandled(id, handled)) }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> =
        try { service.delete(id); ResponseEntity.noContent().build() }
        catch (e: NoSuchElementException) { ResponseEntity.notFound().build() }
}
