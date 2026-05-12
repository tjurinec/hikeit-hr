package hr.vrhiput.dto

import jakarta.validation.constraints.NotBlank

data class CreateGuideRequest(
    @field:NotBlank val name: String,
    val bio: String? = null,
    val avatarUrl: String? = null,
    val specialization: String? = null,
)
