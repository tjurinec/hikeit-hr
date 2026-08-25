package hr.vrhiput.dto

import hr.vrhiput.entity.Gallery
import hr.vrhiput.entity.GalleryImage
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Size

data class GalleryImageDto(
    val id: Long,
    val url: String,
    val caption: String?,
    val location: String?,
)

data class GalleryDto(
    val id: Long,
    val title: String,
    val description: String?,
    val externalUrl: String?,
    val images: List<GalleryImageDto>,
)

data class CreateGalleryImageRequest(
    @field:NotBlank @field:Size(max = 500) val url: String,
    @field:Size(max = 500) val caption: String? = null,
    @field:Size(max = 255) val location: String? = null,
)

data class CreateGalleryRequest(
    @field:NotBlank @field:Size(max = 200) val title: String,
    @field:Size(max = 5000) val description: String? = null,
    @field:Size(max = 500) val externalUrl: String? = null,
    // Galerija bez ijedne slike nema smisla
    @field:NotEmpty @field:Valid @field:Size(max = 200) val images: List<CreateGalleryImageRequest> = emptyList(),
)

fun GalleryImage.toDto() = GalleryImageDto(id, url, caption, location)

fun Gallery.toDto() = GalleryDto(id, title, description, externalUrl, images.map { it.toDto() })
