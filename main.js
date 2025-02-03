


document.addEventListener("DOMContentLoaded", () => {

	const header = document.querySelector('.header');

	if (header) {
		window.addEventListener('scroll', (e) => {
			const scrollPosition = window.scrollY;
			if (scrollPosition > 50) {
				header.classList.add('header-scroll');
			} else {
				header.classList.remove('header-scroll');
			}
			console.log(scrollPosition);
		})
	}


	const items = document.querySelectorAll(".hidden-card-choose");

	if (items) {

		function initObserver(items) {
			const observerOptions = {
				root: null,
				rootMargin: "0px",
				threshold: 0.2,
			};

			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible-card-choose");
						entry.target.classList.remove("hidden-card-choose");
						observer.unobserve(entry.target);
					}
				});
			}, observerOptions);

			items.forEach((item) => observer.observe(item));

		}

		initObserver(items);
	}


	if (document.querySelector('.pop-up')) {

		const initPopUp = () => {

			const popUp = document.querySelector('.pop-up');
			const popUpSliderContainer = document.querySelector('.pop-up__container-slider');
			const lengthImgPopUp = document.querySelector('.length-img-pop-up');
			const indexImgPopUp = document.querySelector('.index-img-pop-up');
			const allImg = document.querySelectorAll('.figure-document__img');
			const btnPrev = document.querySelector('.prev-img');
			const btnNext = document.querySelector('.next-img');
			const btnClose = document.querySelector('.pop-up__close');

			let indexImg = saveIndex();
			let isAnimating = false;


			allImg.forEach((element, index, allElem) => {
				element.addEventListener('click', () => {
					showPopUp(index, allElem, popUpSliderContainer, popUp);
					showLengthImgPopUp(lengthImgPopUp, allImg.length);
					showIndexImgPopUp(indexImgPopUp, index);
					document.body.style.overflow = 'hidden';
				});
			});
			btnClose.addEventListener('click', () => {
				removePopUpImg(popUpSliderContainer);
				closePopUp(popUp);
				// document.body.style.overflow = 'auto';
			});


			btnPrev.addEventListener('click', () => {
				if (!isAnimating) {
					toggleOpacity(popUpSliderContainer);
					isAnimating = true;

					setTimeout(() => {
						showImg('prev');
						toggleOpacity(popUpSliderContainer);
						removeFirstChildIfMultipleChildren(popUpSliderContainer, 'firstElementChild');
						isAnimating = false;
					}, 500);
				}
			});
			btnNext.addEventListener('click', () => {
				if (!isAnimating) {
					isAnimating = true;
					toggleOpacity(popUpSliderContainer);
					setTimeout(() => {
						showImg('next');
						toggleOpacity(popUpSliderContainer);
						removeFirstChildIfMultipleChildren(popUpSliderContainer, 'firstElementChild');
						isAnimating = false;
					}, 500);
				}
			});

			const screenWidth = document.documentElement.clientWidth;
			const screenCenter = screenWidth / 2;
			let isDragging = false;
			let startX;
			let elementCoordinates;

			const handlePointerDown = (e) => {
				if (!e.target.classList.contains('pop-up-img')) return;

				e.preventDefault();
				removeClass(e.target, 'pop-up-left-center');
				removeClass(e.target, 'pop-up-right-center');
				isDragging = true;

				// Определяем начальную точку на основе типа события
				startX = getEventClientX(e) - e.target.getBoundingClientRect().left;
			};


			const handlePointerMove = (e) => {
				if (!isDragging) return;

				e.preventDefault();
				document.body.style.overflow = 'hidden';


				setValueProperty(e.target, 'left', 'initial');
				setValueProperty(e.target, '--x', `${getEventClientX(e) - startX}px`);
				elementCoordinates = getEventClientX(e) - startX;
			};

			const handlePointerUp = (e) => {
				if (!isDragging) return;

				isDragging = false;
				if (!e.target.classList.contains('pop-up-img')) return;

				const elemCenter = e.target.offsetWidth / 2;
				const direction = elementCoordinates + elemCenter < screenCenter ? 'prev' : 'next';

				animateAndShow(e.target, direction, direction === 'prev' ? '-10vw' : '105vw', direction === 'prev' ? 'pop-up-right-center' : 'pop-up-left-center');
			};

			const getEventClientX = (event) => {
				if (event.touches && event.touches[0]) {
					return event.touches[0].clientX; // Touch событие
				}
				return event.clientX; // Mouse или Pointer событие
			};




			popUp.addEventListener('mousedown', handlePointerDown);
			document.addEventListener('mousemove', handlePointerMove);
			document.addEventListener('mouseup', handlePointerUp);

			popUp.addEventListener('touchstart', handlePointerDown, { passive: false });
			document.addEventListener('touchmove', handlePointerMove, { passive: false });
			document.addEventListener('touchend', handlePointerUp);






			function animateAndShow(elem, direction, distance, className) {
				setValueProperty(elem, '--x', distance, 'animation');
				setTimeout(() => {
					showImg(direction, className);
					removeFirstChildIfMultipleChildren(popUpSliderContainer, 'firstElementChild');
				}, 200);
			}
			function setValueProperty(elem, property, distance, animation = false) {
				elem.style.setProperty(property, distance);
				if (animation) {
					elem.style.transition = 'all .3s ease';
				}
			}


			function showPopUp(index, allElem, containerContent, popUp) {
				const imgCopy = allElem[index].cloneNode('true');
				imgCopy.classList.add('pop-up-img');
				imgCopy.classList.remove('figure-document__img');
				containerContent.append(imgCopy);
				popUp.classList.add('pop-up--active');
				indexImg.save(index);
				document.body.style.overflow = 'hidden'
			}
			function closePopUp(popUp) {
				popUp.classList.remove('pop-up--active');
				document.body.style.overflow = ''
			}


			function showImg(direction, animationClass = false) {
				if (animationClass) {
					countIndexElem(direction, indexImg.getSaveIndex(), allImg);
					addingImgInPopUp(popUpSliderContainer, allImg, indexImg.getSaveIndex(), animationClass, indexImgPopUp);
					return;
				}
				countIndexElem(direction, indexImg.getSaveIndex(), allImg);
				addingImgInPopUp(popUpSliderContainer, allImg, indexImg.getSaveIndex(), false, indexImgPopUp);
			}
			function addingImgInPopUp(container, allElem, indexElem, animationClass = false, indexImgPopUp) {
				const clone = allElem[indexElem].cloneNode('true');
				const originalAlt = allElem[indexElem].getAttribute('alt');

				clone.classList.remove('figure-document__img');
				clone.removeAttribute('alt');

				if (originalAlt) {
					clone.setAttribute('alt', originalAlt);
				}

				if (!animationClass) {
					clone.classList.add('pop-up-img');
					container.append(clone);
					showIndexImgPopUp(indexImgPopUp, indexElem);
					return;
				}

				container.append(clone);
				clone.classList.add(animationClass);

				setTimeout(() => {
					clone.classList.add('pop-up-img');

					showIndexImgPopUp(indexImgPopUp, indexElem);

				}, 500);
			}

			function saveIndex() {
				let imgIndex = 0;
				function save(index) {
					imgIndex = index;
				}
				function getSavedIndex() {
					return imgIndex;
				}
				return {
					save: save,
					getSaveIndex: getSavedIndex
				}
			}
			function countIndexElem(direction, index, allElem) {
				if (direction === 'next') {
					if ((allElem.length - 1) === index) {
						index = -1;
					}
					index += 1;
					indexImg.save(index);
					return;
				} else if (direction === 'prev') {
					if (0 === index) {
						index = allElem.length - 1;
					} else {
						index -= 1;
					}
					indexImg.save(index);
				}
			}

			function removePopUpImg(content) {
				content.innerHTML = '';
			}
			function removeFirstChildIfMultipleChildren(allElemPopUp, child) {
				if (allElemPopUp.children.length > 1) {
					allElemPopUp[child].remove();
				}
			}
			function removeClass(elem, className) {
				elem.classList.remove(className);
			}
			function toggleOpacity(elem) {
				elem.classList.toggle('transparent');
			}


			function showLengthImgPopUp(container, length) {
				container.textContent = '/ ' + length;
			}
			function showIndexImgPopUp(container, index) {
				container.textContent = index + 1;
			}


			const fullscreenButton = document.querySelector('.pop-up__fullscreen');
			fullscreenButton.addEventListener('click', toggleFullScreen);

			function toggleFullScreen() {
				if (!document.fullscreenElement) {
					document.documentElement.requestFullscreen();
				} else {
					document.exitFullscreen();
				}
			}
		}
		initPopUp();
	}


	if (document.querySelector('.burger-menu')) {
		const initBurgerMenu = () => {
			const burgerMenu = document.querySelector('.burger-menu');
			const headerNav = document.querySelector('.header__container-navigation');
			const line_1 = document.querySelector('.burger-menu__line-1');
			const line_2 = document.querySelector('.burger-menu__line-2');
			const line_3 = document.querySelector('.burger-menu__line-3');
			let active = false;

			const toggleMenu = () => {
				line_1.classList.toggle('rotate-line-1');
				line_2.classList.toggle('display-none');
				line_3.classList.toggle('rotate-line-3');
				active = !active;

				// Переключаем класс для навигации и body
				headerNav.classList.toggle('active-menu', active);
				document.body.classList.toggle('hidden', active);
			};

			burgerMenu.addEventListener('click', (event) => {
				event.stopPropagation();
				toggleMenu();
			});


			document.addEventListener('click', (event) => {
				if (active && !burgerMenu.contains(event.target) && !headerNav.contains(event.target)) {
					toggleMenu();
				}
			});
		}

		initBurgerMenu();

	}


	if (document.querySelector('.container-slider')) {

		class Slider {
			// Конструктор класса Slider, принимает объект mediaQueries
			constructor(mediaQueries) {
				this.mediaQueries = mediaQueries;  // Медиа-запросы для определения количества видимых слайдов
			}


			// Метод инициализации слайдера, принимает объект с параметрами
			initSlider({
				btnNext = null,
				btnPrev = null,
				slider, item,
				itemLength }) {
				this.flagDragDropMouse = false; // Флаг dragDrop для desktop
				this.flagDragDropTouch = false; // Флаг dragDrop для touch устройств


				this.windowWidth = document.documentElement.clientWidth;  // Ширина окна

				this.elemItem = item;  // Один элемент слайдера
				this.elemBtnNext = btnNext;  // Кнопка для перехода к следующему слайду
				this.elemBtnPrev = btnPrev;  // Кнопка для перехода к предыдущему слайду
				this.elemSlider = slider;  // Сам слайдер


				this.stepNumber = 1; // Текущий шаг
				this.position = 0;  // Начальная позиция слайдера
				this.sliderLength = itemLength;  // Количество элементов item слайдера
				this.visibleSlides = this.getVisibleSlidesMediaQueries(this.mediaQueries);  // Количество видимых слайдов
				this.distance = this.updateWidthItem();  // Ширина одного элемента слайдера
				this.setTotalSteps();

				this.onResize = this.handleResize.bind(this); // обработчик события resize
				this.onDOMLoaded = this.handleDOMLoaded.bind(this); // обработчик события DOMContentLoaded


				// Установка обработчика события, когда документ полностью загружен
				document.addEventListener('DOMContentLoaded', this.onDOMLoaded);

				// Обработчик события изменения размера окна
				window.addEventListener('resize', this.onResize);


				// Установка обработчиков событий для кнопок вперед / назад
				if (this.elemBtnNext && this.elemBtnPrev) {

					this.onclickNext = this.handleClickNext.bind(this);
					this.onclickPrev = this.handleClickPrev.bind(this);


					this.elemBtnNext.addEventListener('click', this.onclickNext);
					this.elemBtnPrev.addEventListener('click', this.onclickPrev);
				}
			}

			dispatchSlideChangeEvent() {
				const event = new CustomEvent('slideChanged', {
					bubbles: true,
					detail: {
						currentStep: this.stepNumber,
						totalSteps: this.totalSteps,
					},
				});

				this.elemSlider.dispatchEvent(event);
			}

			initStepsCallback(callBack) {
				this.callBackSteps = callBack;
			}

			initResizeCallback(callback) {
				this.callBackResize = callback;
			}


			// Удаление событий
			removeAllListener() {

				document.removeEventListener('DOMContentLoaded', this.onDOMLoaded);
				window.removeEventListener('resize', this.onResize);

				if (this.elemBtnNext && this.elemBtnPrev) {
					this.elemBtnNext.removeEventListener('click', this.onclickNext);
					this.elemBtnPrev.removeEventListener('click', this.onclickPrev);
				}

				if (this.flagDragDropMouse) {

					// Обработчики событий для мыши
					this.elemSlider.removeEventListener('mousedown', this.onmousedown, { passive: false });

					this.elemSlider.removeEventListener('mousemove', this.onmousemove, { passive: false });

					document.removeEventListener('mouseup', this.onmouseup);
				}

				if (this.flagDragDropTouch) {

					this.elemSlider.removeEventListener('touchstart', this.ontouchstart, { passive: false });
					this.elemSlider.removeEventListener('touchmove', this.ontouchmove, { passive: false });
					document.removeEventListener('touchend', this.ontouchend);

				}
			}

			handleClickNext() {
				this.moveNext();
				this.updateButtonStates();
				this.setSlideStep();
			}

			handleClickPrev() {
				this.movePrev();
				this.updateButtonStates();
				this.setSlideStep();
			}

			handleResize() {

				let newWindowWidth = document.documentElement.clientWidth;
				if (newWindowWidth === this.windowWidth) return;
				this.resetSlider();
				this.distance = this.updateWidthItem();
				this.visibleSlides = this.getVisibleSlidesMediaQueries(this.mediaQueries);
				this.updateButtonStates();
				this.setTotalSteps();
				this.windowWidth = newWindowWidth;
				this.dispatchSlideChangeEvent();
				if (this.callBackSteps) {
					this.callBackSteps(this.stepNumber, this.totalSteps);
				}
				if (this.callBackResize) {
					this.callBackResize();
				}

			}

			handleDOMLoaded() {
				this.updateButtonStates();
				this.setTotalSteps();
				this.dispatchSlideChangeEvent();
				if (this.callBackSteps) {
					this.callBackSteps(this.stepNumber, this.totalSteps);
				}

			}


			initDragDrop(desktop = false) {
				this.flagDragDropTouch = true;
				this.isDragging = false;  // Флаг перетаскивания
				this.touchStart = 0;  // Начальная точка касания/клика
				this.touchEnd = 0;  // Конечная точка касания/клика
				this.touchMove = 0;  // Текущая позиция перетаскивания
				this.ontouchstart = this.handleStart.bind(this);
				this.ontouchmove = this.handleMove.bind(this);
				this.ontouchend = this.handleEnd.bind(this);

				// Обработчик события начала касания
				this.elemSlider.addEventListener('touchstart', this.ontouchstart, { passive: false });

				// Обработчик события перемещения касания
				this.elemSlider.addEventListener('touchmove', this.ontouchmove, { passive: false });

				// Обработчик события завершения касания
				document.addEventListener('touchend', this.ontouchend);

				if (!desktop) return;
				this.flagDragDropMouse = true;

				this.onmousedown = this.handleStart.bind(this);
				this.onmousemove = this.handleMove.bind(this);
				this.onmouseup = this.handleEnd.bind(this);

				// Обработчики событий для мыши
				this.elemSlider.addEventListener('mousedown', this.onmousedown, { passive: false });

				this.elemSlider.addEventListener('mousemove', this.onmousemove, { passive: false });

				document.addEventListener('mouseup', this.onmouseup);
			}

			handleStart(e) {
				e.preventDefault();
				const clientX = e.touches ? e.touches[0].clientX : e.clientX;

				this.startDragDrop(clientX);

			}

			handleMove(e) {
				if (!this.isDragging) return;
				// e.preventDefault();
				const clientX = e.touches ? e.touches[0].clientX : e.clientX;
				this.moveDragDrop(clientX);
			}

			handleEnd(e) {
				if (!this.isDragging) return;
				// e.preventDefault();
				this.endDragDrop();

			}

			// Метод начала перетаскивания
			startDragDrop(value) {
				this.isDragging = true;
				this.touchStart = value;
			}

			// Метод перемещения при перетаскивании
			moveDragDrop(value) {
				this.touchMove = value - this.touchStart + this.position;
				this.animateSlider(this.elemSlider, this.touchMove);
				this.touchEnd = value;
			}

			// Метод завершения перетаскивания
			endDragDrop() {
				this.isDragging = false;
				this.position = this.touchMove;

				setTimeout(() => {
					// Если позиция больше 0, вернуться к началу
					if (this.position > 0) {
						this.animateSlider(this.elemSlider, 0);
						this.position = 0;

						this.setSlideStep();

						// Если позиция меньше конца слайдера, вернуться к концу
					} else if (this.position < this.sliderEnd()) {
						this.animateSlider(this.elemSlider, this.sliderEnd());
						this.position = this.sliderEnd();
						this.setSlideStep();
						// Если перетаскивание было значительным, перейти на следующий слайд
					} else if (this.touchEnd - this.touchStart < -20) {
						this.position = this.distance * (Math.floor(this.position / this.distance));

						this.setSlideStep();
						this.animateSlider(this.elemSlider, this.position);

						// Если перетаскивание было значительным, перейти на предыдущий слайд
					} else if (this.touchEnd - this.touchStart > 20) {
						this.position = this.distance * (Math.ceil(this.position / this.distance));

						this.setSlideStep();
						this.animateSlider(this.elemSlider, this.position);
						// Иначе, оставить на текущем слайде

					} else {
						this.position = this.distance * (Math.round(this.position / this.distance));
						this.animateSlider(this.elemSlider, this.position);
					}
					this.updateButtonStates();
					this.dispatchSlideChangeEvent();
				}, 100);
			}

			// Метод вычисления конца слайдера
			sliderEnd() {
				return -(this.sliderLength * this.distance - this.visibleSlides * this.distance);
			}

			// Метод установки общего количества шагов
			setTotalSteps() {
				this.totalSteps = this.sliderLength - this.visibleSlides + 1;
			}

			// Метод установки текущего шага
			setSlideStep() {
				if (this.position > 0) return;
				const valueStep = Math.abs(this.position / this.distance) + 1;
				this.stepNumber = valueStep;

				if (this.callBackSteps) {
					this.callBackSteps(this.stepNumber, this.totalSteps);
				}
				this.dispatchSlideChangeEvent();
			}

			// Метод получения количества видимых слайдов по медиа-запросам
			getVisibleSlidesMediaQueries(media) {
				for (let key in media) {
					if (media[key].matches) {
						return parseInt(key);
					}
				}
			}

			// Метод обновления ширины элемента
			updateWidthItem() {
				return this.elemItem.offsetWidth;
			}

			//Метод проверки кнопок для отключения или включения
			updateButtonStates() {
				if (this.elemBtnNext) {
					this.elemBtnNext.disabled = this.position <= this.sliderEnd();
				}
				if (this.elemBtnPrev) {
					this.elemBtnPrev.disabled = this.position >= 0;
				}
			}

			// Метод перехода к следующему слайду
			moveNext() {
				const valueEnd = this.visibleSlides * this.distance - this.distance * this.sliderLength;
				if (this.position <= valueEnd) return;

				this.position = this.position - this.distance;
				this.animateSlider(this.elemSlider, this.position);
			}

			// Метод перехода к предыдущему слайду
			movePrev() {

				if (this.position === 0) return;

				this.position = this.position + this.distance;
				this.animateSlider(this.elemSlider, this.position);
			}

			// Метод анимации слайдера
			animateSlider(elem, valueTranslate) {
				requestAnimationFrame(() => {
					elem.style.transform = `translateX(${valueTranslate}px)`;
				});
			}

			// Метод сброса слайдера
			resetSlider() {
				this.stepNumber = 1;
				this.position = 0;
				this.animateSlider(this.elemSlider, this.position);
			}
		}



		// Объект медиа-запросов, в ключах прописываем сколько видно слайдов, в css устанавливаем какое количество слайдов  видно,  например:
		//  .item {
		// 	flex-shrink: 0;
		// 	flex-grow: 0;
		// 	width: 25%; (25% это 4 слайда , 50% = 2 , 33% = 3, и тд)
		// 	padding: 0 14px;
		// } для правильной работы счетчика шагов нужно прописать ключ для каждого изменения кол-ва слайдов и указать разрешение при котором кол-во видимых слайдов меняется(медиа запросы в css)


		const media = {
			1: window.matchMedia('(max-width: 1024px)'),
			2: window.matchMedia('(min-width: 1025px)')
		};

		// Можно создать много слайдеров, для этого добавляем container-slider с его дочерними элементами в html
		document.querySelectorAll('.container-slider').forEach((elem, index) => {
			//Объект с элементами слайдера, если кнопки ненужны не указываем их в объекте
			const $sliderAllElem = {
				btnNext: document.querySelectorAll('.next-btn-arrow')[index],
				btnPrev: document.querySelectorAll('.prev-btn-arrow')[index],
				slider: elem.querySelector('.slider'),
				itemLength: elem.querySelectorAll('.item').length,
				item: elem.querySelector('.item'),
			}


			const sliderObj = new Slider(media);
			sliderObj.initSlider($sliderAllElem);//инициализация слайдера
			sliderObj.initDragDrop('desktop');//инициализация drag'n drop не обязательна, если для desktop ненужно, то вызываем метод без аргумента
		});



	}


});
