/*!
* Advisr v2.0.0 (https://advisr.com.au/)
*/

class AdvisrTeamPage extends HTMLElement {
	constructor() {
		super();
		this.apikey = scriptParams.apikey;
		this.advisrBrokersConfig = scriptParams.advisrBrokersConfig;
		this.teamMembers = scriptParams.teamMembers;
	}

	async connectedCallback() {
		if (jQuery('#members-wrapper').length != 0) {
			return;
		}

		if (!this.apikey) {
			throw new Error('API token not provided');
		}

		try {
			this.advisrBrokerageWithBrokersAndReviews = await this.fetchFromAdvisrApi(this.apikey);
		} catch (error) {
			throw new Error(error);
		}

		this.render(this.advisrBrokerageWithBrokersAndReviews, this.teamMembers, this.advisrBrokersConfig);
	}

	sanitiseTeamMember(item) {
		// return only used properties
		return {
			id: item.id || '',
			name: item.name || '',
			avatar_url: item.avatar_url || 'https://advisr.com.au/storage/users/default.png', // @TODO replace this further up the chain
			mobile: item.mobile || '',
			role: item.role || '',
			profile_url: item.profile_url,
			telephone: item.telephone || '',
			email: item.email || '',
			rating: item.rating || null,
			description: item.description || '',
			reviews: item.reviews || []
		}
	}

	render(advisrBrokerageWithBrokersAndReviews, teamMembers = [], advisrBrokersConfig) {
		
		if (typeof(advisrBrokersConfig) === 'string') {
			advisrBrokersConfig = JSON.parse(advisrBrokersConfig);
		}
		if (typeof(advisrBrokersConfig) === 'string') {
			advisrBrokersConfig = JSON.parse(advisrBrokersConfig);
		}

		// add order from config object
		for (let broker of advisrBrokerageWithBrokersAndReviews.brokers) {
			for (let advisrBrokersConfigItem of advisrBrokersConfig) {
				if (parseInt(advisrBrokersConfigItem.id.replace('advisr-order-', '')) === broker.id) {
					broker.order = parseInt(advisrBrokersConfigItem.value);
					break;
				}
			}
		}

		// sort brokers according to order field
		advisrBrokerageWithBrokersAndReviews.brokers.sort((a,b) => {
			if (a.order > b.order) return 1;
			if (b.order > a.order) return -1;
			return 0;
		});

		const mergedTeamMembers = advisrBrokerageWithBrokersAndReviews.brokers.map(broker => this.sanitiseTeamMember(broker));
		
		// insert client team members into main array
		teamMembers.forEach(teamMember => {
			this.insertAt(mergedTeamMembers, teamMember.order, this.sanitiseTeamMember(teamMember))
		})

		if (!mergedTeamMembers) {
			fragment.querySelector('#members-wrapper').innerHTML = 'No brokers found.';
		}

		const template = document.createElement('template');

		template.innerHTML += `
		<div class="advisr-prefix-class jumbotron">
			<div id='members-wrapper' class="advisr-prefix-class team-member__container container"></div>
		</div>`;

		let fragment = document.importNode(template.content, true);

		let membersHtml = '';

		if (mergedTeamMembers && mergedTeamMembers.length > 0) {
			membersHtml += `<div class="advisr-prefix-class team-member-row row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5 pb-5">`;
				mergedTeamMembers.forEach((member, index) => {
					membersHtml += `<div class="advisr-prefix-class team-member-col col">`
						membersHtml += `<div class="advisr-prefix-class team-member-card card h-100 text-center">`;
							const imageHtml = member.avatar_url ?
								`<div class="advisr-prefix-class team-member-image btn embed-responsive embed-responsive-1by1 border border-5 border-white"
 									data-bs-toggle="modal" data-bs-target="#memberModal"
 									data-bs-selected="${index}">
 									<img src="${member.avatar_url}" 
 										class="advisr-prefix-class image img-fluid embed-responsive-item border border-5 border-white">
								</div>` : '';
							const nameHtml = member.name ?
								`<h4 class="advisr-prefix-class team-member-name card-title clickable text-black"
									data-bs-toggle="modal" data-bs-target="#memberModal"
 									data-bs-selected="${index}">
									${member.name}
								</h4>` : '';
							const roleHtml = member.role ?
								`<p class="advisr-prefix-class team-member-role text-muted fw-bold medium clickable"
									data-bs-toggle="modal" data-bs-target="#memberModal"
 									data-bs-selected="${index}">
									${member.role}
								</p>` : '';
							const mobileHTML = member.mobile ? `<p><a class="advisr-prefix-class team-member-mobile card-text text-muted small" href="tel:${member.mobile}">${member.mobile}</a></p>` : '';
							const telephoneHTML = member.telephone ? `<p><a class="advisr-prefix-class team-member-telephone card-text text-muted small" href="tel:${member.telephone}">${member.telephone}</a></p>` : '';
							const enquireHtml = member.email ? `<a href="mailto:${member.email}" class="advisr-prefix-class team-member-email btn btn-dark mb-4">Connect</a>`: '';
							membersHtml += imageHtml  +
								`<div class="advisr-prefix-class team-member-contact card-body">`
									+ nameHtml + roleHtml + mobileHTML + telephoneHTML +
								`</div>` +
								`<div class="advisr-prefix-class team-member-enquiry card-footer bg-transparent border-top-0">`
									+ enquireHtml +
								`</div>` ;
						membersHtml += `</div>`;
					membersHtml += `</div>`;
				});
			membersHtml += `</div>`;

			membersHtml +=
				`<div class="advisr-prefix-class team-member__modal-container modal fade" id="memberModal" tabindex="-1" aria-labelledby="memberModalLabel" aria-hidden="true">
				<div class="advisr-prefix-class team-member__modal-dialog modal-dialog modal-lg modal-dialog-centered">
					<div class="advisr-prefix-class team-member__modal-content modal-content">
						<div class="advisr-prefix-class team-member__modal-header modal-header border-0 pb-0">
							<button type="button" class="advisr-prefix-class btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="advisr-prefix-class team-member__modal-body modal-body pt-2 pb-0">
							<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
								<div class="advisr-prefix-class team-member__modal-col col-sm-6 col-md-5 col-lg-3 d-flex align-items-center">
									<div class="advisr-prefix-class team-member__modal-image embed-responsive embed-responsive-1by1">
										<img id="modalAvatar" src="https://advisr.com.au/storage/users/default.png" class="advisr-prefix-class image img-fluid embed-responsive-item">	
									</div>
								</div>
								<div class="advisr-prefix-class team-member__modal-card-col col-sm-6 col-md-7 col-lg-9">
									<div class="advisr-prefix-class team-member__modal-card-body card-body">
										<h4 id="modalName" class="advisr-prefix-class text-black"></h4>
										<p id="modalRole" class="advisr-prefix-class text-muted fw-bold medium"></p>
										<p><a id="modalMobile" href="" class="advisr-prefix-class card-text text-muted small"></a></p>
										<p><a id="modalTelephone" href="" class="advisr-prefix-class card-text text-muted small"></a></p>
										<span class="advisr-prefix-class d-flex flex-row flex-gap mb-1">
											<p id="modalReviewSummary"></p>
											<small id="modalReviewsCount" class="advisr-prefix-class ml-1 text-muted"></small>
										</span>
										<a id="modalConnectButton" href="" class="advisr-prefix-class btn btn-dark my-1">Connect</a>
										<a id="modalReviewButton" href="" class="advisr-prefix-class btn btn-dark my-1 mx-2">Review</a>
									</div>
								</div>
							 </div>
						</div>
						<div class="advisr-prefix-class team-member__modal-description modal-body">
							<div class="advisr-prefix-class team-member__modal-description-row row g-0 m-0">
								<div class="advisr-prefix-class team-member__modal-description-col col-lg-12 mb-3">
									<div class="advisr-prefix-class px-2">
										<p id="modalDescriptionSnippet" class="advisr-prefix-class text-muted small justify-text"></p>
										<p id="modalDescription" class="advisr-prefix-class collapse text-muted small" aria-expanded="false"></p>
										<a id="modalDescriptionButton" role="button" class="advisr-prefix-class small collapsed" data-bs-toggle="collapse" href="#modalDescription" aria-expanded="false" aria-controls="modalDescription"></a>
									</div>
								</div>
							</div>
						</div>
						<div id="modalCarouselReviewSection" class="advisr-prefix-class team-member__modal-review modal-body">
							<div class="advisr-prefix-class team-member__modal-review-row row g-0 m-0">
								<div class="advisr-prefix-class team-member__modal-review-col col-lg-12">
									<div id="modalReviewsHeader" class="advisr-prefix-class team-member__modal-review-header border-top border-2 border-dark mx-2">
										<h4 class="advisr-prefix-class fw-bold py-3 text-black">Reviews</h4>
									</div>
									<div id="modalCarouselReviews" class="advisr-prefix-class team-member__modal-review-carousel carousel slide" data-bs-ride="carousel">
										<div id="modalCarouselIndicators" class="advisr-prefix-class team-member__modal-review-indicators carousel-indicators">					
										</div>
										<div id="modalCarouselCards" class="advisr-prefix-class team-member__modal-review-carousel-cards carousel-inner">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		}

		fragment.querySelector('#members-wrapper').innerHTML = membersHtml;
		const component = document.querySelector('advisr-team-page');
		component.appendChild(fragment);

		// Initialise modal windows
		jQuery(document).ready(function () {
			jQuery.HSCore.components.HSModalWindow.init("[data-modal-target]", ".js-modal-window", { autonomous: true});

			let memberModal = document.getElementById('memberModal')
			memberModal.addEventListener('show.bs.modal', function (event) {
				// Button that triggered the modal
				let button = event.relatedTarget;
				// Extract info from data-bs-* attributes
				let selected = button.getAttribute('data-bs-selected');
				let avatar = mergedTeamMembers[selected].avatar_url;
				let name = mergedTeamMembers[selected].name;
				let role = mergedTeamMembers[selected].role;
				let mobile = mergedTeamMembers[selected].mobile;
				let telephone = mergedTeamMembers[selected].telephone;
				let rating = mergedTeamMembers[selected].rating;
				let ratingHtml = rating ? getStarRating(rating) : '';
				let reviews = mergedTeamMembers[selected].reviews;
				let reviewsCount = reviews.length ? `(${reviews ? reviews.length : 0} ${reviews.length === 1 ? 'review' : 'reviews'})` : ''
				let profileURL = mergedTeamMembers[selected].profile_url;
				let email = mergedTeamMembers[selected].email;
				let description = extractContent(mergedTeamMembers[selected].description);
				let descriptionCutOff = 500;
				let descriptionPart2 = description.substring(descriptionCutOff);

				if (description.length > descriptionCutOff) {
					let period = descriptionPart2.indexOf('.');
					let space = descriptionPart2.indexOf(' ');
					descriptionCutOff += Math.max(Math.min(period, space), 0);
				}
				descriptionPart2 = description.substring(descriptionCutOff);

				let descriptionPart1 = description.substring(0, descriptionCutOff);

				if (!descriptionPart2.length) {
					jQuery("#modalDescriptionSnippet").text(descriptionPart1);
					jQuery("#modalDescriptionButton").hide();
				} else {
					jQuery("#modalDescription").text(descriptionPart2);
					jQuery("#modalDescriptionButton").show();
					toggleReadMore(descriptionPart1);
					jQuery("#modalDescriptionButton").click(function () {
						setTimeout(function() {
							toggleReadMore(descriptionPart1);
						}, 500);
					});
				}

				jQuery("#modalAvatar").attr("src",avatar);
				jQuery("#modalName").text(name);
				jQuery("#modalRole").text(role);
				jQuery("#modalMobile").attr("href", `tel:${mobile}`);
				jQuery("#modalMobile").text(mobile);
				jQuery("#modalTelephone").attr("href", `tel:${telephone}`);
				jQuery("#modalTelephone").text(telephone);
				jQuery("#modalReviewSummary").html(ratingHtml);
				jQuery("#modalReviewsCount").text(reviewsCount);
				jQuery("#modalConnectButton").attr("href", `mailto:${email}`);
				jQuery("#modalReviewButton").attr("href", profileURL);

				if(reviews.length > 0) {
					jQuery("#modalCarouselReviewSection").show();
					jQuery("#modalCarouselIndicators").append(generateCarouselIndicators(reviews));
					jQuery("#modalCarouselCards").append(generateCarouselReviewCards(reviews));
					jQuery("#modalCarouselReviews").carousel({
						interval: 5500
					});
				} else {
					jQuery("#modalCarouselReviewSection").hide();
				}

			});

			memberModal.addEventListener('hidden.bs.modal', function (event) {
				jQuery("#modalDescription").text('');
				jQuery("#modalCarouselIndicators>button").remove();
				jQuery("#modalCarouselCards>div").remove();
			});

			function toggleReadMore(descriptionPart1) {
				if(jQuery("#modalDescription").hasClass("show")) {
					jQuery("#modalDescriptionSnippet").text(descriptionPart1);
					jQuery("#modalDescriptionButton").text("- Read less");
				} else {
					jQuery("#modalDescriptionSnippet").text(descriptionPart1 + '...');
					jQuery("#modalDescriptionButton").text("+ Read more");
				}
			}

			function getStarRating(rating) {
				let ratingHtml = `<ul class="list-inline small m-0 p-0">`;
				for (var i = 0; i < rating; i++) {
					ratingHtml += `<li class="list-inline-item m-0 mr-1"><span class="fa fa-star text-warning"></span> </li>`;
				}
				for (var j = rating; j < 5; j++) {
					ratingHtml += `<li class="list-inline-item m-0 mr-1"><span class="fa fa-star-o"></span></li>`;
				}
				ratingHtml += `</ul>`;
				return ratingHtml;
			}

			function extractContent(s) {
				var span = document.createElement('span');
				span.innerHTML = s;
				return span.textContent || span.innerText;
			}

			function generateCarouselIndicators(reviews) {
				let modalCarouselIndicatorHTML = '';
				reviews.reverse().forEach((review, index) => {
					if(index === 0) {
						modalCarouselIndicatorHTML += `<button type="button" data-bs-target="#modalCarouselReviews" data-bs-slide-to="${index}" class="advisr-prefix-class active carousel-indicator" aria-current="true" aria-label="Review 1"></button>`
					} else {
						modalCarouselIndicatorHTML += `<button type="button" data-bs-target="#modalCarouselReviews" data-bs-slide-to="${index}" class="advisr-prefix-class carousel-indicator" aria-label="Review ${index + 1}"></button>`
					}
				});
				return modalCarouselIndicatorHTML;
			}

			function generateCarouselReviewCards(reviews) {
				let carouselReviewCardHTML = '';
				reviews.reverse().forEach((review, index) => {
					if(index === 0) {
						carouselReviewCardHTML += `<div class="advisr-prefix-class carousel-item active">`;
					} else {
						carouselReviewCardHTML += `<div class="advisr-prefix-class carousel-item">`;
					}
					carouselReviewCardHTML +=
						`<div class="advisr-prefix-class mb-5 mx-2">
							<div class="advisr-prefix-class d-flex flex-row justify-content-between">
								<h5 class="advisr-prefix-class fw-bold text-black">${review.reviewer}</h5>
						</div>`;
					carouselReviewCardHTML += getStarRating(review.rating)
					carouselReviewCardHTML += `<p class="advisr-prefix-class my-3 small text-black">${review.comment}</p></div>`;
					carouselReviewCardHTML += '</div>';
				})
				return carouselReviewCardHTML;
			}

			function timeSince(date) {
				var seconds = Math.floor((new Date() - Date.parse(date)) / 1000);
				var interval = Math.floor(seconds / 31536000);
				if (interval > 1) {
					return interval + " years ago";
				} else if (interval === 1) {
					return interval + " year ago";
				}
				interval = Math.floor(seconds / 2592000);
				if (interval > 1) {
					return interval + " months ago";
				}
				interval = Math.floor(seconds / 86400);
				if (interval > 1) {
					return interval + " days ago";
				}
				interval = Math.floor(seconds / 3600);
				if (interval > 1) {
					return interval + " hours ago";
				}
				interval = Math.floor(seconds / 60);
				if (interval > 1) {
					return interval + " minutes ago";
				}
				return Math.floor(seconds) + " seconds ago";
			}
		})
	}

	// insert profile in specific position
	insertAt(array, index, item) {
		array.splice(index - 1, 0, item);
	}

	async fetchFromAdvisrApi(apikey) {
		const url = `https://advisr.com.au/api/v1/brokerages/4208?withBrokers=true&withReviews=true&recursiveReviews=true`;

		var myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${apikey}`);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		try {
			const res = await fetch(url, requestOptions);
			return await res.json();
		} catch {
			console.log("Error");
		}
	}
}

customElements.define('advisr-team-page', AdvisrTeamPage);