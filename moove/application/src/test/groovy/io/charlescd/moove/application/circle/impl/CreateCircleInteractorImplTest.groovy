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

package io.charlescd.moove.application.circle.impl

import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.CreateCircleInteractor
import io.charlescd.moove.application.circle.request.CreateCircleRequest
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import io.charlescd.moove.domain.service.SecurityService
import spock.lang.Specification

class CreateCircleInteractorImplTest extends Specification {

    private CreateCircleInteractor createCircleInteractor
    private CircleRepository circleRepository = Mock(CircleRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)
    private SecurityService securityService = Mock(SecurityService)

    void setup() {
        this.createCircleInteractor = new CreateCircleInteractorImpl(
                new CircleService(circleRepository),
                new UserService(userRepository, securityService),
                new WorkspaceService(workspaceRepository, userRepository),
                circleMatcherService,
        )
    };

    def "should create a new circle"() {
        given:
        def author = TestUtils.user
        def workspace =  TestUtils.workspace
        def circle =  TestUtils.circle
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization

        def request = new CreateCircleRequest("Women", TestUtils.nodePart)

        when:
        def response = this.createCircleInteractor.execute(request, workspaceId, authorization)

        then:
        1 * securityService.getUser(authorization) >> author
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * circleRepository.save(_) >> circle
        1 * circleMatcherService.create(circle, workspace.circleMatcherUrl)

        notThrown(NotFoundException)

        assert response != null
        assert response.id == circle.id
        assert response.author.id == TestUtils.authorId
        assert response.createdAt == circle.createdAt
        assert response.matcherType == circle.matcherType
        assert response.name == circle.name
        assert response.reference == circle.reference
        assert response.workspaceId == circle.workspaceId
        assert response.default == circle.defaultCircle
        assert !response.default
    }

    def "should throw a NotFoundException when user does not exists"() {

        def workspaceId = TestUtils.workspaceId
        def authorId = TestUtils.authorId
        def authorization = TestUtils.authorization

        given:
        def request = new CreateCircleRequest("Women", TestUtils.nodePart)

        when:
        this.createCircleInteractor.execute(request, workspaceId, authorization)

        then:
        1 * securityService.getUser(authorization) >> { throw new NotFoundException("user", authorId) }
        0 * userRepository.findById(authorId) >> Optional.of(TestUtils.user)

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "user"
        assert exception.id == authorId
    }

    def "should throw a NotFoundException when workspace does not exists"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization

        def request = new CreateCircleRequest("Women", TestUtils.nodePart)

        when:
        this.createCircleInteractor.execute(request, workspaceId, authorization)

        then:
        1 * securityService.getUser(authorization) >> author
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "workspace"
        assert exception.id == workspaceId
    }


}
