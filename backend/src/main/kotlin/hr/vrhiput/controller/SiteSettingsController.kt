package hr.vrhiput.controller

import hr.vrhiput.dto.SiteSettingsDto
import hr.vrhiput.dto.UpdateSiteSettingsRequest
import hr.vrhiput.service.SiteSettingsService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/settings")
class SiteSettingsController(private val service: SiteSettingsService) {

    /** Javno — koriste ga kontakt stranica i footer. */
    @GetMapping
    fun get(): SiteSettingsDto = service.get()

    @PutMapping
    fun update(@Valid @RequestBody req: UpdateSiteSettingsRequest): SiteSettingsDto = service.update(req)
}
