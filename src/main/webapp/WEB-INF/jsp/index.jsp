<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
	<link rel="icon" type="image/png" href="/img/wtemap_logo.jpg">
    <title>오먹</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
    <link href="/css/style.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=92cf059f8f9ea7d41d7bd359613e8c66&libraries=services,clusterer,drawing"></script>
</head>
<body>
<nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand">
            <i class="fa-solid fa-bowl-food text-success me-2"></i><strong>오먹</strong>
        </a>
    </div>
</nav>

<div class="d-flex main-container">
    <!-- 세로 메뉴 -->
    <div id="side-menu" class="d-flex flex-column align-items-center pt-3">
        <button id="menu-home" class="active" title="지도 홈"><i class="fa-solid fa-house"></i></button>
        <button id="menu-fav" title="찜 메뉴"><i class="fa-solid fa-heart"></i></button>
    </div>

    <!-- 검색 섹션 -->
    <div id="search-section" class="active p-3">
        <form id="form" action="/recommend" method="post" class="px-3 py-4">
		    <div class="mb-3">
		        <label for="area" class="form-label">지역</label>
		        <select class="form-select" id="area" name="area" required>
		            <option>강남</option>
		            <option>홍대</option>
		            <option>신촌</option>
		        </select>
		    </div>
		
		    <div class="mb-3">
		        <label for="category" class="form-label">음식 종류</label>
		        <select class="form-select" id="category" name="category" required>
		            <option>한식</option>
		            <option>일식</option>
		            <option>중식</option>
		            <option>양식</option>
		            <option>카페</option>
		        </select>
		    </div>
		
		    <div class="mb-3">
		        <label for="sort" class="form-label">정렬 기준</label>
		        <select class="form-select" id="sort" name="sort" required>
		            <option value="default">카카오 기준</option>
		            <option value="rating">별점순</option>
		            <option value="distance">거리순</option>
		        </select>
		    </div>
		
		    <input type="hidden" name="userX" id="userX" />
		    <input type="hidden" name="userY" id="userY" />
		
		    <button type="submit" class="btn btn-primary">🍽 추천 받기</button>
		</form>

        <hr />

        <ul class="list-group flex-grow-1 overflow-auto" id="restaurantList">
		        <c:if test="${empty restaurants}">
		        <li class="list-group-item text-center text-danger animate-blink">
		            <i class="fa-solid fa-circle-exclamation"></i>
		            &nbsp;"추천받기" 버튼을 눌러 맛집을 검색하세요.
		        </li>
		    </c:if>
            <c:forEach var="r" items="${restaurants}">
                <li class="list-group-item d-flex justify-content-between align-items-start" 
                    data-x="${r.x}" data-y="${r.y}" data-name="${r.name}" data-address="${r.address}" data-rating="${r.rating}" data-distance="${r.distance}">
                    <div>
                        <div class="fw-bold">${r.name}</div>
                        ${r.address}<br/>
                        ⭐ ${r.rating} • ${r.distance} km
                    </div>
                    <button class="fav-btn" title="즐겨찾기">♡</button>
                </li>
            </c:forEach>
        </ul>
    </div>

    <!-- 찜 섹션 -->
	<div id="fav-section" class="p-3">
	    <h5>즐겨찾기 목록</h5>
	    <ul class="list-group" id="favList">
		    <c:if test="${empty restaurants}">
	            <li class="list-group-item text-center text-danger animate-blink">
	                <i class="fa-solid fa-circle-exclamation"></i>
	                &nbsp;찜한 식당이 없습니다.<br> "추천받기" 버튼을 눌러 맛집을 검색하세요.
	            </li>
	        </c:if>
	        <!-- JS에서 렌더링 -->
	    </ul>
	</div>

    <!-- 지도 -->
    <div id="map"></div>
</div>

<script src="/js/app.js"></script>

</body>
</html>