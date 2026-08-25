package hr.vrhiput.service

import hr.vrhiput.dto.SiteSettingsDto
import hr.vrhiput.dto.UpdateSiteSettingsRequest
import hr.vrhiput.dto.toDto
import hr.vrhiput.entity.ContactPhone
import hr.vrhiput.entity.SiteSettings
import hr.vrhiput.repository.SiteSettingsRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime

@Service
@Transactional(readOnly = true)
class SiteSettingsService(private val repo: SiteSettingsRepository) {

    fun get(): SiteSettingsDto = load().toDto()

    @Transactional
    fun update(req: UpdateSiteSettingsRequest): SiteSettingsDto {
        val s = load()
        s.apply {
            contactEmail = req.contactEmail.orNull()
            phones = req.phones
                .filter { it.number.isNotBlank() }
                .map { ContactPhone(it.label?.trim()?.ifBlank { null }, it.number.trim()) }
                .toMutableList()
            location = req.location.orNull()
            locationNote = req.locationNote.orNull()
            workingHours = req.workingHours.orNull()
            workingHoursNote = req.workingHoursNote.orNull()
            instagramUrl = req.instagramUrl.orNull()
            facebookUrl = req.facebookUrl.orNull()
            updatedAt = OffsetDateTime.now()
        }
        return repo.save(s).toDto()
    }

    /** Red uvijek postoji (kreiran migracijom), ali ne oslanjamo se na to. */
    private fun load(): SiteSettings = repo.findById(1).orElseGet { SiteSettings() }

    private fun String?.orNull(): String? = this?.trim()?.ifBlank { null }
}
