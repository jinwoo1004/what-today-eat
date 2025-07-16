$(function () {
    let map;
    let markers = [];

    // 지도 초기화
    function initMap(lat = 37.5665, lon = 126.9780) {
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(lat, lon),
            level: 4
        };
        map = new kakao.maps.Map(container, options);
        addMarkers();
    }

    // 마커 모두 제거
    function clearMarkers() {
        markers.forEach(m => m.setMap(null));
        markers = [];
    }

    // 마커 추가 및 리스트 클릭 이벤트 연결
    function addMarkers() {
        clearMarkers();
        $('#restaurantList li').each(function () {
            const $li = $(this);
            const x = parseFloat($li.data('x'));
            const y = parseFloat($li.data('y'));
            const title = $li.data('name');

            const marker = new kakao.maps.Marker({
                map: map,
                position: new kakao.maps.LatLng(y, x),
                title: title
            });

            markers.push(marker);

            // 리스트 클릭 시 지도 센터 이동 및 마커 애니메이션
            $li.off('click').on('click', () => {
				if ($(this).hasClass('text-danger') && $(this).hasClass('animate-blink')) {
				    e.stopPropagation();
				    return; // 안내 메시지는 클릭 무시
				}
                map.setCenter(marker.getPosition());
                marker.setZIndex(999);
                marker.setAnimation(kakao.maps.Animation.BOUNCE);
                setTimeout(() => marker.setAnimation(null), 1400);
            });
        });
    }

    // 즐겨찾기 토글
    function toggleFav(title, btn) {
        let favs = JSON.parse(localStorage.getItem('favs') || '[]');
        if (favs.includes(title)) {
            favs = favs.filter(f => f !== title);
            btn.text('♡');
        } else {
            favs.push(title);
            btn.text('❤️');
        }
        localStorage.setItem('favs', JSON.stringify(favs));
    }

    // 즐겨찾기 버튼 초기화 상태 설정
    function initFavButtons() {
        let favs = JSON.parse(localStorage.getItem('favs') || '[]');
        $('#restaurantList li').each(function () {
            const $li = $(this);
            const title = $li.data('name');
            const btn = $li.find('.fav-btn');
            if (favs.includes(title)) {
                btn.text('❤️');
            } else {
                btn.text('♡');
            }
            btn.off('click').on('click', (e) => {
                e.stopPropagation(); // li 클릭 이벤트 방지
                toggleFav(title, btn);
            });
        });
    }

    // 찜 리스트 렌더링
	function renderFavList() {
	    let favs = JSON.parse(localStorage.getItem('favs') || '[]');
	    let $favList = $('#favList');
	    $favList.empty();

		if (favs.length === 0) {
		    $favList.append(`
		        <li class="list-group-item text-center text-danger animate-blink">
		            <i class="fa-solid fa-circle-exclamation"></i>
		            &nbsp;찜한 식당이 없습니다. <br> "추천받기" 버튼을 눌러 맛집을 검색하세요.
		        </li>
		    `);
		    return;
		}

	    favs.forEach(title => {
	        // 추천 리스트에서 해당 제목의 li 가져오기
	        const $originLi = $(`#restaurantList li[data-name="${title.replace(/"/g,'\\"')}"]`);
	        if ($originLi.length === 0) return; // 없으면 건너뛰기

	        // 원본 데이터 가져오기
	        const address = $originLi.data('address');
	        const rating = $originLi.data('rating');
	        const distance = $originLi.data('distance');

	        const $li = $(`
	            <li class="list-group-item d-flex justify-content-between align-items-start" style="cursor:pointer;" data-x="${$originLi.data('x')}" data-y="${$originLi.data('y')}" data-name="${title}">
	                <div>
	                    <div class="fw-bold">${title}</div>
	                    ${address}<br/>
	                    ⭐ ${rating} • ${distance} km
	                </div>
	                <button class="btn btn-outline-danger btn-sm fav-remove-btn" title="찜 해제">❤️</button>
	            </li>
	        `);

	        // 찜 해제 버튼 클릭
	        $li.find('.fav-remove-btn').click((e) => {
	            e.stopPropagation();
	            favs = favs.filter(f => f !== title);
	            localStorage.setItem('favs', JSON.stringify(favs));
	            renderFavList();
	            initFavButtons();
	        });

	        // 찜 리스트 항목 클릭 시 지도 이동
	        $li.click(() => {
				if ($(this).hasClass('text-danger') && $(this).hasClass('animate-blink')) {
				    e.stopPropagation();
				    return; // 안내 메시지는 클릭 무시
				}
	            const $targetLi = $(`#restaurantList li[data-name="${title.replace(/"/g,'\\"')}"]`);
	            if ($targetLi.length) {
	                $targetLi.trigger('click');
	                // 메뉴 자동 홈탭 전환
	                $('#menu-home').trigger('click');
	            } else {
	                alert('찜한 식당이 현재 검색 결과에 없습니다.');
	            }
	        });

	        $favList.append($li);
	    });
	}

    // 메뉴 토글
    $('#menu-home').click(function () {
        $(this).addClass('active');
        $('#menu-fav').removeClass('active');
        $('#search-section').addClass('active');
        $('#fav-section').removeClass('active');
    });

    $('#menu-fav').click(function () {
        $(this).addClass('active');
        $('#menu-home').removeClass('active');
        $('#search-section').removeClass('active');
        $('#fav-section').addClass('active');
        renderFavList();
    });

    // 사용자 위치 자동 세팅
    navigator.geolocation.getCurrentPosition(pos => {
        $('#userX').val(pos.coords.longitude);
        $('#userY').val(pos.coords.latitude);
    }, () => {
        // 위치정보 못가져오면 기본 서울 좌표
        $('#userX').val(126.9780);
        $('#userY').val(37.5665);
    });

    // 초기 실행
    if ($('#restaurantList li').length > 0) {
        initMap();
        initFavButtons();
    } else {
        initMap(); // 기본 지도
    }
	
});