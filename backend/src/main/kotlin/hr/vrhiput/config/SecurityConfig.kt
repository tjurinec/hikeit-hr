package hr.vrhiput.config

import hr.vrhiput.repository.AdminUserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun userDetailsService(repo: AdminUserRepository): UserDetailsService =
        UserDetailsService { username ->
            val admin = repo.findByUsername(username)
                .orElseThrow { UsernameNotFoundException("Korisnik '$username' nije pronađen") }
            User.withUsername(admin.username)
                .password(admin.password)
                .roles("ADMIN")
                .build()
        }

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                // Javni GET endpointi
                auth.requestMatchers(HttpMethod.GET, "/api/excursions/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/gallery/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/guides/**").permitAll()
                // Upload slika — javno dostupno za sad (zaštititi u produkciji)
                auth.requestMatchers("/api/upload/**").permitAll()
                // Admin endpointi — zahtijevaju Basic Auth
                auth.requestMatchers(HttpMethod.POST, "/api/excursions/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/excursions/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/excursions/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.POST, "/api/gallery/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/gallery/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.POST, "/api/guides/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.PUT, "/api/guides/**").hasRole("ADMIN")
                auth.requestMatchers(HttpMethod.DELETE, "/api/guides/**").hasRole("ADMIN")
                auth.anyRequest().authenticated()
            }
            .httpBasic { }
        return http.build()
    }
}
