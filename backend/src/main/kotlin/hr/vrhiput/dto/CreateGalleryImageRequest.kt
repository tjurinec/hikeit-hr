package hr.vrhiput.dto

import jakarta.validation.constraints.NotBlank

data class CreateGalleryImageRequest(
    @field:NotBlank val url: String,
    val caption: String? = null,
    val location: String? = null,
    val category: String? = null,
    val excursionId: Long? = null,
    val sortOrder: Int = 0,
)
