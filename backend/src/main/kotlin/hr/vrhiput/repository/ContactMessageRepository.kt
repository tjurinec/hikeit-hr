package hr.vrhiput.repository

import hr.vrhiput.entity.ContactMessage
import org.springframework.data.jpa.repository.JpaRepository

interface ContactMessageRepository : JpaRepository<ContactMessage, Long> {
    fun findAllByOrderByCreatedAtDesc(): List<ContactMessage>
    fun countByHandledFalse(): Long
}
