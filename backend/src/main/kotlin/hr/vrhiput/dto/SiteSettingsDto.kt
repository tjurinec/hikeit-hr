package hr.vrhiput.dto

import hr.vrhiput.entity.ContactPhone
import hr.vrhiput.entity.SiteSettings
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ContactPhoneDto(
    @field:Size(max = 100) val label: String? = null,
    @field:NotBlank @field:Size(max = 50) val number: String = "",
)

data class SiteSettingsDto(
    val contactEmail: String?,
    val phones: List<ContactPhoneDto>,
    val location: String?,
    val locationNote: String?,
    val workingHours: String?,
    val workingHoursNote: String?,
    val instagramUrl: String?,
    val facebookUrl: String?,
    val galleryIntro: String?,
)

data class UpdateSiteSettingsRequest(
    @field:Size(max = 200) val contactEmail: String? = null,
    @field:Valid @field:Size(max = 10) val phones: List<ContactPhoneDto> = emptyList(),
    @field:Size(max = 200) val location: String? = null,
    @field:Size(max = 200) val locationNote: String? = null,
    @field:Size(max = 2000) val workingHours: String? = null,
    @field:Size(max = 300) val workingHoursNote: String? = null,
    @field:Size(max = 300) val instagramUrl: String? = null,
    @field:Size(max = 300) val facebookUrl: String? = null,
    @field:Size(max = 2000) val galleryIntro: String? = null,
)

fun ContactPhone.toDto() = ContactPhoneDto(label, number)

fun SiteSettings.toDto() = SiteSettingsDto(
    contactEmail, phones.map { it.toDto() }, location, locationNote,
    workingHours, workingHoursNote, instagramUrl, facebookUrl, galleryIntro,
)
