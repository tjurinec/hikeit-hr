package hr.vrhiput.service

import hr.vrhiput.dto.CreateGuideRequest
import hr.vrhiput.dto.GuideDto
import hr.vrhiput.dto.toDto
import hr.vrhiput.entity.Guide
import hr.vrhiput.repository.GuideRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class GuideAdminService(
    private val repo: GuideRepository,
    private val imageCleanup: ImageCleanupService,
) {

    fun getAll(): List<GuideDto> = repo.findAll().map { it.toDto() }

    @Transactional
    fun create(req: CreateGuideRequest): GuideDto =
        repo.save(Guide(name = req.name, bio = req.bio, avatarUrl = req.avatarUrl, specialization = req.specialization)).toDto()

    @Transactional
    fun update(id: Long, req: CreateGuideRequest): GuideDto {
        val guide = repo.findById(id).orElseThrow { NoSuchElementException("Vodič $id nije pronađen") }
        val stariAvatar = guide.avatarUrl
        guide.apply {
            name = req.name
            bio = req.bio
            avatarUrl = req.avatarUrl
            specialization = req.specialization
        }
        val dto = repo.save(guide).toDto()
        repo.flush()
        if (stariAvatar != req.avatarUrl) imageCleanup.deleteIfUnused(stariAvatar)
        return dto
    }

    @Transactional
    fun delete(id: Long) {
        val guide = repo.findById(id).orElseThrow { NoSuchElementException("Vodič $id nije pronađen") }
        val avatar = guide.avatarUrl
        repo.delete(guide)
        repo.flush()
        imageCleanup.deleteIfUnused(avatar)
    }
}
