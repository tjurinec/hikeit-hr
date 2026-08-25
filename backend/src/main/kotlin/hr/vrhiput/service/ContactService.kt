package hr.vrhiput.service

import hr.vrhiput.dto.ContactMessageDto
import hr.vrhiput.dto.CreateContactMessageRequest
import hr.vrhiput.dto.toDto
import hr.vrhiput.entity.ContactMessage
import hr.vrhiput.repository.ContactMessageRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class ContactService(
    private val repo: ContactMessageRepository,
    private val mailSender: JavaMailSender,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    /** Adresa na koju stižu obavijesti. Prazno = obavijesti isključene. */
    @Value("\${app.contact.notify-email:}")
    private lateinit var notifyEmail: String

    @Value("\${spring.mail.username:}")
    private lateinit var mailFrom: String

    fun getAll(): List<ContactMessageDto> = repo.findAllByOrderByCreatedAtDesc().map { it.toDto() }

    fun countUnhandled(): Long = repo.countByHandledFalse()

    @Transactional
    fun create(req: CreateContactMessageRequest): ContactMessageDto {
        val saved = repo.save(
            ContactMessage(
                name = req.name.trim(),
                email = req.email.trim(),
                phone = req.phone?.trim()?.ifBlank { null },
                subject = req.subject?.trim()?.ifBlank { null },
                message = req.message.trim(),
            )
        )
        notify(saved)
        return saved.toDto()
    }

    @Transactional
    fun setHandled(id: Long, handled: Boolean): ContactMessageDto {
        val msg = repo.findById(id).orElseThrow { NoSuchElementException("Poruka $id nije pronađena") }
        msg.handled = handled
        return repo.save(msg).toDto()
    }

    @Transactional
    fun delete(id: Long) {
        if (!repo.existsById(id)) throw NoSuchElementException("Poruka $id nije pronađena")
        repo.deleteById(id)
    }

    /**
     * Obavijest je najbolji trud — poruka je već spremljena, pa neuspjeh slanja
     * ne smije srušiti zahtjev ni izgubiti upit.
     */
    private fun notify(msg: ContactMessage) {
        if (notifyEmail.isBlank() || mailFrom.isBlank()) return
        try {
            mailSender.send(SimpleMailMessage().apply {
                setFrom(mailFrom)
                setTo(notifyEmail)
                setReplyTo(msg.email)
                subject = "hikeIT upit: ${msg.subject ?: "bez teme"} — ${msg.name}"
                text = """
                    Ime:     ${msg.name}
                    Email:   ${msg.email}
                    Telefon: ${msg.phone ?: "-"}
                    Tema:    ${msg.subject ?: "-"}

                    ${msg.message}
                """.trimIndent()
            })
        } catch (e: Exception) {
            log.warn("Ne mogu poslati obavijest o upitu ${msg.id}: ${e.message}")
        }
    }
}
