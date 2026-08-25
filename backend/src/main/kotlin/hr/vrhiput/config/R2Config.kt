package hr.vrhiput.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import java.net.URI

@Configuration
class R2Config(
    @Value("\${app.r2.account-id}") private val accountId: String,
    @Value("\${app.r2.access-key}") private val accessKey: String,
    @Value("\${app.r2.secret-key}") private val secretKey: String,
) {

    @Bean
    fun s3Client(): S3Client = S3Client.builder()
        .endpointOverride(URI.create("https://$accountId.r2.cloudflarestorage.com"))
        .region(Region.of("auto"))
        .credentialsProvider(
            StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey))
        )
        .httpClient(UrlConnectionHttpClient.builder().build())
        .build()
}
