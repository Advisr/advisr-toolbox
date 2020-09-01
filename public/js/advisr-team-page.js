class AdvisrTeamPage extends HTMLElement {
	constructor() {
		super();
		this.apikey = scriptParams.apikey;
		this.teamMembers = scriptParams.teamMembers;
		this.membersBefore = scriptParams.membersBefore;
		this.membersAfter = scriptParams.membersAfter;
	}

	async connectedCallback() {
		if (!this.apikey) {
			throw new Error('API token not provided');
		}

		try {
			// @TODO change this
			this.advisrBrokerageWithBrokersAndReviews = await this.fetchFromAdvisrApi(this.apikey);
			// this.advisrBrokerageWithBrokersAndReviews = {
			// 	"id": 3508,
			// 	"name": "Brokerage Test 3",
			// 	"first_name": "Brokerage",
			// 	"last_name": "Test3",
			// 	"rating": 4,
			// 	"description": "<p>fixed</p>",
			// 	"abn": null,
			// 	"acn": null,
			// 	"afsl": null,
			// 	"ar_number": null,
			// 	"car_number": null,
			// 	"telephone": null,
			// 	"mobile": null,
			// 	"company": null,
			// 	"country": null,
			// 	"state": "NSW",
			// 	"city": null,
			// 	"address_1": null,
			// 	"address_2": null,
			// 	"postcode": "2031",
			// 	"views": null,
			// 	"slug": "brokerage-test-3",
			// 	"website_url": null,
			// 	"linkedin_url": null,
			// 	"video_url": null,
			// 	"avatar_url": "https://staging.advisr.com.au/storage/users/default.png",
			// 	"banner_url": null,
			// 	"profile_url": "https://staging.advisr.com.au/brokerage-test-3",
			// 	"brokers": [
			// 		{
			// 			"id": 1991,
			// 			"name": "Aaron Macdonald",
			// 			"first_name": "Aaron",
			// 			"last_name": "Macdonald",
			// 			"telephone": "1300 268 371",
			// 			"mobile": "0422 354 334",
			// 			"avatar_url": "https://staging.advisr.com.au/storage/users/Aaron-Macdonald_Business-Insurance-Cover-Services-1.jpg",
			// 			"profile_url": "https://staging.advisr.com.au/aaron-macdonald"
			// 		},
			// 		{
			// 			"id": 1728,
			// 			"name": "Abby Li",
			// 			"first_name": "Abby",
			// 			"last_name": "Li",
			// 			"telephone": "02 9261 1571",
			// 			"mobile": "0449 636 278",
			// 			"avatar_url": "https://staging.advisr.com.au/storage/users/default.png",
			// 			"profile_url": "https://staging.advisr.com.au/abby-li"
			// 		}
			// 	],
			// 	"reviews": [
			// 		{
			// 			"id": 1701,
			// 			"rating": 3,
			// 			"reviewer": "Reviewer's name",
			// 			"comment": "comment",
			// 			"date": "2020-08-28 12:17:52",
			// 			"reviewee_id": 1991,
			// 			"reviewee": "Aaron Macdonald"
			// 		},
			// 		{
			// 			"id": 1702,
			// 			"rating": 5,
			// 			"reviewer": "evthedev",
			// 			"comment": "asdasd",
			// 			"date": "2020-08-28 12:18:23",
			// 			"reviewee_id": 1728,
			// 			"reviewee": "Abby Li"
			// 		}
			// 	]
			// }
		} catch (error) {
			throw new Error(error);
		}

		this.render(this.advisrBrokerageWithBrokersAndReviews, this.teamMembers, this.membersBefore, this.membersAfter);
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
			rating: item.rating || null,
			description: item.description || '',
			reviews: item.reviews || []
		}
	}

	render(advisrBrokerageWithBrokersAndReviews, teamMembers = [], membersBefore = false, membersAfter = false) {

		const advisrBrokers = advisrBrokerageWithBrokersAndReviews.brokers;
		const reviews = advisrBrokerageWithBrokersAndReviews.reviews;

		const mergedTeamMembers = [
			...teamMembers.filter(item => membersBefore && item.group === 'before').map(item => this.sanitiseTeamMember(item)),
			...advisrBrokers.map(item => this.sanitiseTeamMember(item)),
			...teamMembers.filter(item => membersAfter && item.group === 'after').map(item => this.sanitiseTeamMember(item)),
		];

		if (!mergedTeamMembers) {
			fragment.querySelector('#members-wrapper').innerHTML = 'No brokers found.';
		}

		const template = document.createElement('template');
		template.innerHTML += `<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet"></link>`;
		template.innerHTML += `<link rel="stylesheet" href="https://advisr.com.au/vendor/custombox/dist/custombox.min.css">`;
		template.innerHTML += `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">`;

		template.innerHTML += `
		<style>
			.mb-3, .my-3 {
				margin-bottom: 1rem;
			}
			.mb-2, .my-2 {
				margin-bottom: .5rem;
			}
			.ml-0, .mx-0 {
				margin-left: 0;
			}
			.mr-0, .mx-0 {
				margin-right: 0;
			}
			.d-flex {
				display: -webkit-box;
				display: flex;
			}
			.flex-row {
				-webkit-box-orient: horizontal;
				-webkit-box-direction: normal;
				flex-direction: row;
			}
			.justify-content-between {
				-webkit-box-pack: justify;
				justify-content: space-between;
			}
			.list-inline {
				padding-left: 0;
				margin-top: 0;
				margin-bottom: 0.5rem;
				list-style: none;
			}
			.list-inline-item {
				display: inline-block;
			}
			.list-inline-item:not(:last-child) {
				margin-right: .2rem;
			}
			.text-warning {
				color: #ffc107;
			}
			.image {
				object-fit: cover;
			}
			.custombox-lock {
				overflow: auto;
			}
			.u-custombox-no-scroll.custombox-lock {
				margin-right: 1.0625rem;
				overflow: hidden;
			}
			.custombox-content, .custombox-overlay {
				width: 100vw;
			}
			.u-modal-window {
				display: none;
				max-height: 85vh;
				width: 680px;
			}
			@media  screen and (max-width: 720px) {
				.u-modal-window {
					width: 95vw;
				}
				.grecaptcha-badge{
					display: none !important;
				}
			}
		</style>
		<div class="custombox-container custombox-top" style="">
			<div id='members-wrapper'></div>
		</div>`;

		let fragment = document.importNode(template.content, true);

		let membersHtml = '';

		if (mergedTeamMembers && mergedTeamMembers.length > 0) {
			membersHtml += `<div class="container"><div class="row">`;
			mergedTeamMembers.forEach((member) => {

				membersHtml += `<div class="team-member-item col-12 col-sm-6 col-md-4 col-lg-3 mb-5">`;
				const imageHtml = member.avatar_url ? `<div class="team-member-image embed-responsive embed-responsive-1by1 mb-4"><img src="${member.avatar_url}" class="image img-fluid embed-responsive-item"></div>` : '';
				const nameHtml = member.name ? `<div class="team-member-name mb-4"><h2 class="name m-0">${member.name}</h2></div>` : '';
				const starRatingHtml = member.rating ? this.getStarRatingHtml(member.rating) : '';
				const roleHtml = member.role ? `<div class="team-member-role mb-2"><p class="role">${member.role}</p></div>` : '';
				const launchModalHtml = member.id ? `<a href="#messageModal-${ member.id }" data-modal-target="#messageModal-${ member.id }" data-modal-effect="blur" data-modal-is-closing-by-esc="true" data-modal-is-closing-by-overlay="true">See more</a>` : '';
				membersHtml += imageHtml  + nameHtml + starRatingHtml + roleHtml + launchModalHtml;
				membersHtml += '</div>';
				membersHtml += `<div id="messageModal-${ member.id }" class="js-modal-window u-modal-window">
									<div class="bg-light position-relative">
										<div class="container">
											<div class="row justify-content-center">
												<div class="col-12 p-5">
													<div class="float-right">
														<button type="button" class="close" aria-label="Close" onclick="Custombox.modal.close();">
															<span aria-hidden="true">×</span>
														</button>
													</div>
								
													<div class="row">
														<div class="col-sm-4 mb-7 mb-lg-0 pr-lg-5">
															<div class="position-relative u-xl-avatar d-inline-block avatar-wrapper">
																<img class="rounded-circle u-sm-avatar--bordered"
																	style="width: 160px; height: 160px; object-fit: cover;"
																	src="${member.avatar_url}">
															</div>
							
							
														</div>
														<div class="col-sm-8 mb-7 mb-lg-0 pr-lg-5">
															<!-- User Details -->
															<div class="mb-0">
																<div class="d-lg-flex align-items-center">
																	<h2 class="h4 m-0 mb-2">${member.name}</h2> 
																</div>
																${member.role}
																</div>
															<!-- End User Details -->
							
															<!-- Collections -->
															<ul class="list-inline d-flex align-items-center my-1 mx-0">
																<li class="list-inline-item m-0">
																	<div class="d-flex align-items-center" id="gotoReviews" style="cursor:pointer;">
																	
																		${this.getStarRatingHtml(member.rating)}
							
																		<div class="text-secondary ml-2">
																		(${member.reviews ? member.reviews.length : 0} ${member.reviews.length === 1 ? 'review' : 'reviews'})
																		</div>
																	</div>
																</li>
															</ul>
															<div class="my-3 d-flex justify-content-start">
																${member.mobile && `
																	<a class="text-primary click-mobile mr-3" href="tel:${member.mobile}">
																		<i class="fa fa-mobile mr-1"></i> ${member.mobile}
																	</a>
																`}
																${member.telephone && `
																	<a class="text-primary click-telephone mr-3" href="tel:${member.telephone}">
																		<i class="fa fa-phone mr-1"></i> ${member.telephone}
																	</a>
																`}																
															</div>
															<div class="d-flex justify-content-start">
																<a type="button" href="${member.profile_url}#reviews" class="btn btn-primary btn-sm mt-2 add-review mr-3 py-2 px-3">Write a Review
																</a>
																<a type="button" href="${member.profile_url}" class="btn btn-primary btn-sm mt-2 add-review py-2 px-3">Send a message
																</a>
															</div>
															<p class="mt-3">${this.removeTags(member.description)}</p>
														</div>
													</div>
							
													<hr class="my-7">
							
													<div class="row">
														<div class="col-12">
															<div id="reviews" class=" mb-3">
																<h3 class="h4 mt-2 mb-5 text-center">
																	Reviews
																	<span class="text-muted font-size-1">
																		(${member.reviews ? member.reviews.length : 0} ${member.reviews.length === 1 ? 'review' : 'reviews'})
																	</span>
																</h3>
																${this.getReviewsHtml(member.reviews)}

															</div>
														</div>
													</div>
												</div>
												<!-- Contact Form -->
							
											</div>
										</div>
									</div>
								</div>`;
			})
			membersHtml += '</div></div>';
		} else {
			membersHtml = '<p>No brokers found.</p>';
		}

		fragment.querySelector('#members-wrapper').innerHTML = membersHtml;
		const component = document.querySelector('advisr-team-page');
		component.appendChild(fragment);

		// Initialise modal windows
		jQuery(document).ready(function () {
			jQuery.HSCore.components.HSModalWindow.init("[data-modal-target]", ".js-modal-window", { autonomous: true}); 
		})

	}

	// strip html tags
	removeTags = input => input ? input.toString().replace( /(<([^>]+)>)/ig, '') : '';

	// calculate time since in a nice readable format
	timeSince = date => {
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

	// generate rating markup
	getStarRatingHtml = (rating) => {
		let ratingHtml = `<ul class="list-inline small m-0">`;
		for (var i = 0; i < rating; i++) {
			ratingHtml += `<li class="list-inline-item m-0"><span class="fa fa-star text-warning"></span> </li>`;
		}
		for (var j = rating; j < 5; j++) {
			ratingHtml += `<li class="list-inline-item m-0"><span class="fa fa-star-o"></span></li>`;
		}
		ratingHtml += `</ul>`;
		return ratingHtml;
	}
	
	// generate reviews markup
	getReviewsHtml = (reviews) => {			
		let reviewsHtml = `<div class="review-wrapper mt-3">`;
		if (reviews && reviews.length > 0) {	
			reviews.reverse().forEach((review) => {
				reviewsHtml += `<div class="review-item mb-5"><div class="d-flex flex-row justify-content-between"><h4 class="reviewer-name m-0 mb-2">${review.reviewer}</h4><span class="small review-date">${this.timeSince(review.date)}</span></div>`;
				reviewsHtml += this.getStarRatingHtml(review.rating);
				reviewsHtml += `<p class="mt-2">${review.comment}</p></div>`
			})
		} else {
			reviewsHtml += 'No reviews.';
		}
		reviewsHtml += '</div>';
		return reviewsHtml;
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