package hr.vrhiput.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.nio.file.Paths

@Configuration
class StaticResourceConfig : WebMvcConfigurer {

    @Value("\${app.upload-dir}")
    private lateinit var uploadDir: String

    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        val absolutePath = Paths.get(uploadDir).toAbsolutePath().normalize()
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:$absolutePath/")
    }
}
