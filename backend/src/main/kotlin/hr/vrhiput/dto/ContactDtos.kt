package hr.vrhiput.dto

import hr.vrhiput.entity.ContactMessage
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.OffsetDateTime

// Javni endpoint — granica povjerenja, pa su ograničenja stroga.
data class CreateContactMessageRequest(
    @field:NotBlank @field:Size(max = 120) val name: String,
    @field:NotBlank @field:Email @field:Size(max = 200) val email: String,
    @field:Size(max = 50) val phone: String? = null,
    @field:Size(max = 120) val subject: String? = null,
    @field:NotBlank @field:Size(max = 5000) val message: String,
)

data class ContactMessageDto(
    val id: Long,
    val name: String,
    val email: String,
    val phone: String?,
    val subject: String?,
    val message: String,
    val handled: Boolean,
    val createdAt: OffsetDateTime,
)

fun ContactMessage.toDto() = ContactMessageDto(id, name, email, phone, subject, message, handled, createdAt)
