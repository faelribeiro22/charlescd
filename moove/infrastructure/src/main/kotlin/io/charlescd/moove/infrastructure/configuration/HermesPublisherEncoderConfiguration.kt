/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.infrastructure.configuration

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import feign.Logger
import feign.Response
import feign.Retryer
import feign.codec.Encoder
import feign.codec.ErrorDecoder
import feign.form.FormEncoder
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import java.io.IOException
import java.lang.Exception
import java.lang.IllegalArgumentException
import java.lang.RuntimeException
import java.nio.charset.StandardCharsets
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.ObjectFactory
import org.springframework.boot.autoconfigure.http.HttpMessageConverters
import org.springframework.cloud.openfeign.support.SpringEncoder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Scope
import org.springframework.util.StreamUtils

@Configuration
class HermesPublisherEncoderConfiguration(
    val messageConverters: ObjectFactory<HttpMessageConverters>
) {

    @Bean
    fun hermesPublisherFeignLogger(): Logger.Level {
        return Logger.Level.FULL
    }

    @Bean
    @Scope("prototype")
    fun hermesPublisherFeignFormEncoder(): Encoder {
        return FormEncoder(SpringEncoder(messageConverters))
    }

    @Bean
    fun hermesPublisherErrorDecoder(): ErrorDecoder {
        return CustomErrorDecoder()
    }

    @Bean
    fun hermesPublisherRetryer(): Retryer {
        return Retryer.Default(5, 30, 5) // TODO: Verificar se é assim e colocar em properties
    }

    class CustomErrorDecoder : ErrorDecoder {
        private val logger = LoggerFactory.getLogger(this.javaClass)
        override fun decode(methodKey: String?, response: Response?): Exception {
            val responseMessage: String? = this.extractMessageFromResponse(response)
            return when (response?.status()) {
                400 -> IllegalArgumentException(responseMessage)
                422 -> BusinessException.of(MooveErrorCode.INVALID_PAYLOAD, responseMessage ?: response.reason())
                else -> RuntimeException(responseMessage)
            }
        }

        private fun extractMessageFromResponse(response: Response?): String? {
            var responseAsString: String? = null
            try {
                responseAsString = response?.body()?.let {
                    StreamUtils.copyToString(it.asInputStream(), StandardCharsets.UTF_8)
                }
                return responseAsString?.let {
                    getResponseAsObject(it)
                }
            } catch (ex: IOException) {
                logger.error(ex.message, ex)
                return responseAsString ?: "Error reading response of request"
            }
        }
        private fun getResponseAsObject(message: String): String {
            val objectResponse = jacksonObjectMapper().readValue(message, ErrorResponse::class.java)
            return objectResponse.message.toString()
        }
    }
    @JsonIgnoreProperties(ignoreUnknown = true)
    data class ErrorResponse(
        val statusCode: String,
        val message: Any,
        val error: String
    )
}
