package hr.vrhiput.dto

import hr.vrhiput.entity.Difficulty
import jakarta.validation.constraints.*
import java.math.BigDecimal
import java.time.LocalDate

data class CreateExcursionRequest(
    @field:NotBlank val title: String,
    @field:NotBlank val description: String,
    val content: String? = null,
    @field:NotNull val difficulty: Difficulty,
    @field:Min(1) val durationDays: Int,
    @field:Min(1) @field:Max(50) val maxParticipants: Int,
    @field:DecimalMin("0.0") val price: BigDecimal? = null,
    val coverImageUrl: String? = null,
    val location: String? = null,
    val startingPoint: String? = null,
    val guideId: Long? = null,
    val tags: Set<String> = emptySet(),
    val featured: Boolean = false,
    val published: Boolean = false,
    val nextDeparture: LocalDate? = null,
)
