package hr.vrhiput.service

import hr.vrhiput.dto.CreateGuideRequest
import hr.vrhiput.dto.GuideDto
import hr.vrhiput.dto.toDto
import hr.vrhiput.entity.Guide
import hr.vrhiput.repository.GuideRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class GuideAdminService(private val repo: GuideRepository) {

    fun getAll(): List<GuideDto> = repo.findAll().map { it.toDto() }

    @Transactional
    fun create(req: CreateGuideRequest): GuideDto =
        repo.save(Guide(name = req.name, bio = req.bio, avatarUrl = req.avatarUrl, specialization = req.specialization)).toDto()

    @Transactional
    fun update(id: Long, req: CreateGuideRequest): GuideDto {
        val guide = repo.findById(id).orElseThrow { NoSuchElementException("Vodič $id nije pronađen") }
        guide.apply {
            name = req.name
            bio = req.bio
            avatarUrl = req.avatarUrl
            specialization = req.specialization
        }
        return repo.save(guide).toDto()
    }

    @Transactional
    fun delete(id: Long) {
        if (!repo.existsById(id)) throw NoSuchElementException("Vodič $id nije pronađen")
        repo.deleteById(id)
    }
}
