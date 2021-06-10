/*!
* Advisr v1.0.0 (https://advisr.com.au/)
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
		<div class="custombox-container custombox-top" style="">
			<div id='members-wrapper'></div>
		</div>`;

		let fragment = document.importNode(template.content, true);
		let fragment1 = document.importNode(template.content, true);

		let membersHtml = '';


		if (mergedTeamMembers && mergedTeamMembers.length > 0) {
			membersHtml += `<div class="team-member__container container"><div class="team-member__row row">`;
			mergedTeamMembers.forEach((member) => {
				membersHtml += `<div class="team-member-item col-12 col-sm-6 col-md-4 col-lg-4 mb-3">`;
				membersHtml += `<div class="team-member-wrapper">`;
				const imageHtml = member.avatar_url ? `<div class="team-member-image embed-responsive embed-responsive-1by1 mb-4"><a href="#messageModal-${ member.id }" data-modal-target="#messageModal-${ member.id }" data-modal-effect="blur" data-modal-is-closing-by-esc="true" data-modal-is-closing-by-overlay="true"><img src="${member.avatar_url}" class="image img-fluid embed-responsive-item"></a></div>` : '';
				const nameHtml = member.name ? `<div class="team-member-name mb-1"><h4 class="name m-0"><a href="#messageModal-${ member.id }" data-modal-target="#messageModal-${ member.id }" data-modal-effect="blur" data-modal-is-closing-by-esc="true" data-modal-is-closing-by-overlay="true">${member.name}</a></h4></div>` : '';
				const starRatingHtml = member.rating ? this.getStarRatingHtml(member.rating) : '';
				const roleHtml = member.role ? `<div class="team-member-role my-2 text-secondary"><p class="role mb-0"><a href="#messageModal-${ member.id }" data-modal-target="#messageModal-${ member.id }" data-modal-effect="blur" data-modal-is-closing-by-esc="true" data-modal-is-closing-by-overlay="true">${member.role}</a></p></div>` : '';
				const launchModalHtml = member.id ? `<div class="my-3 d-flex justify-content-start">
																${member.mobile && `
																	<a class="text-primary click-mobile mr-3" href="tel:${member.mobile}">
																		<i class="fa fa-mobile mr-1"></i> ${member.mobile}
																	</a>
																`}
																${member.telephone && `
																	<a class="text-primary click-telephone mr-3 phone-no-sec" href="tel:${member.telephone}">
																		 ${member.telephone}
																	</a>
																`}																
															</div>` : '';
				const enquireHtml = member.email ? `<div class="team-member-enquire my-2"><a type="button" href="mailto:${member.email}" class="btn btn-primary my-2 email mr-3 py-2 px-4 connect-btn">Connect</a></div>`: '';
				// membersHtml +=`<div class="my-3 d-flex justify-content-start">
				// 												${member.mobile && `
				// 													<a class="text-primary click-mobile mr-3" href="tel:${member.mobile}">
				// 														<i class="fa fa-mobile mr-1"></i> ${member.mobile}
				// 													</a>
				// 												`}
				// 												${member.telephone && `
				// 													<a class="text-primary click-telephone mr-3" href="tel:${member.telephone}">
				// 														<i class="fa fa-phone mr-1"></i> ${member.telephone}
				// 													</a>
				// 												`}																
				// 											</div>`;


				membersHtml += imageHtml  + nameHtml + starRatingHtml + roleHtml + launchModalHtml + enquireHtml;
				membersHtml += '</div>';
				membersHtml += `<div id="messageModal-${ member.id }" class="js-modal-window u-modal-window team-member__modal-window">
									<div class="bg-light position-relative">
										<div class="container team-member__modal-container">
											<div class="row justify-content-center team-member__modal-row">
												<div class="col-12 p-5 team-member__modal-wrapper">
													<button type="button" class="close" aria-label="Close" onclick="Custombox.modal.close();">
														<span aria-hidden="true">×</span>
													</button>
								
													<div class="row mb-5">
														<div class="col-sm-4 mb-7 mb-lg-0 member-image-wrapper">
															<div class="position-relative u-xl-avatar d-inline-block avatar-wrapper">
																<img class="rounded-circle u-sm-avatar--bordered"
																	
																	src="${member.avatar_url}">
															</div>
							
							
														</div>
														<div class="col-sm-8 mb-7 mb-lg-0 member-details-wrapper">
															<div class="outer">
															<div class="middle">
															<div class="inner">
															<!-- User Details -->
															<div class="mb-3">
																<div class="d-lg-flex align-items-center">
																	<h5 class="m-0">${member.name}</h2> 
																</div>
																<span class="role text-secondary">${member.role}</span>
															</div>
															<!-- End User Details -->
							
															<!-- Collections -->
															
															<div class="my-3 d-flex justify-content-start">
																${member.mobile && `
																	<a class="text-primary click-mobile mr-3" href="tel:${member.mobile}">
																		 ${member.mobile}
																	</a>
																`}
																${member.telephone && `
																	<a class="text-primary click-telephone mr-3" href="tel:${member.telephone}">
																		 ${member.telephone}
																	</a>
																`}																
															</div>
															<ul class="list-inline d-flex align-items-center my-1 mx-0 reviews-info">
																<li class="list-inline-item m-0">
																	<div class="d-flex align-items-center" id="gotoReviews">
																	
																		${this.getStarRatingHtml(member.rating)}
							
																		<div class="text-secondary ml-2">
																		(${member.reviews ? member.reviews.length : 0} ${member.reviews.length === 1 ? 'review' : 'reviews'})
																		</div>
																	</div>
																</li>
															</ul>
															<div class="d-flex justify-content-start">			
																<a type="button" href="mailto:${member.email}" class="btn btn-primary my-2 send-message py-2 px-3 connect-detail">Connect
																	</a>
																${member.email && `
																		<a type="button" href="${member.profile_url}" target="_blank" class="btn btn-primary my-2 add-review mr-3 py-2 px-3 connect-review">Review 
																</a>
																`}
															</div>
														</div>	
														</div>
													    </div>
														</div>
													</div>
													<div class="row">
													    <div class="col-md-12">
		<div class="reviewtekst"><p>${this.removeTags(member.description)}</p></div>
													
														</div>
													</div>
							
													<hr class="my-5">
														





													

													<div class="row reviews-main-section">



		
														<div class="col-12">



															<div id="reviews" class=" mb-3">
	<h3 class="h3 mt-2 mb-5 text-center">Reviews
<span class="text-muted font-size-1">
(${member.reviews ? member.reviews.length : 0} ${member.reviews.length === 1 ? 'review' : 'reviews'})
</span>
</h3>																${this.getReviewsHtml(member.reviews)}
</div>
														<div id="carousel-modal-demo" class="carousel slide" data-ride="carousel">
																 
																<!-- Sliding images starting here -->
																 
																<div class="carousel-inner">
																 
																<div class="item">
																 
																 <h3 class="h3 mt-2 mb-5 text-center">
																	<span class="text-muted font-size-1">
																		
																	</span>
																</h3>
																<!-- {this.getReviewsHtml(member.reviews)} -->

																</div>
																</div>
														   </div> 

														</div>
													</div>
												</div>
												<!-- Contact Form -->
							
											</div>
										</div>
									</div>
								</div>
								</div>`;

			})

			membersHtml += '</div></div>';
		} else {
			membersHtml = '<p>No brokers found.</p>';
		}

var membersHtml1 = `
<script>
$(".slideshow .review-wrapper .review-item").hide();

setInterval(function() {
  $('.slideshow .review-wrapper .review-item:first')
    .fadeOut(2000)
    .next()
    .fadeIn(4000)
    .end()
    .appendTo('.slideshow');
}, 3000);
</script>

<script>jQuery('.reviewtekst').each(function() {
    var jQuerypTag = jQuery(this).find('p');
    if(jQuerypTag.text().length > 500){
        var shortText = jQuerypTag.text();
        shortText = shortText.substring(0, 500);
        jQuerypTag.addClass('fullArticle').hide();
        shortText += '<a href="#" class="read-more-link">....<span class="re-more">Read more +</span></a>';
        jQuerypTag.append('<a href="#" class="read-less-link"> Read less -</a>');
        jQuery(this).append('<p class="preview">'+shortText+'</p>');
    }
});

jQuery(document).on('click', '.read-more-link', function () {
    jQuery(this).parent().hide().prev().show();
});

jQuery(document).on('click', '.read-less-link', function () {
    jQuery(this).parent().hide().next().show();
});</script> `;
			

		fragment.querySelector('#members-wrapper').innerHTML = membersHtml;
		const component = document.querySelector('advisr-team-page');
		component.appendChild(fragment);
        jQuery('#carousel-modal-demo').after(membersHtml1);
		// Initialise modal windows
		jQuery(document).ready(function () {

			jQuery.HSCore.components.HSModalWindow.init("[data-modal-target]", ".js-modal-window", { autonomous: true}); 
		})

	}

	// insert profile in specific position
	insertAt(array, index, item) {
		array.splice(index - 1, 0, item);
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
			ratingHtml += `<li class="list-inline-item m-0 mr-1"><span class="fa fa-star text-warning"></span> </li>`;
		}
		for (var j = rating; j < 5; j++) {
			ratingHtml += `<li class="list-inline-item m-0 mr-1"><span class="fa fa-star text-warning"></span></li>`;
		}
		ratingHtml += `</ul>`;
		return ratingHtml;
	}
	
	// generate reviews markup
	getReviewsHtml = (reviews) => {			
		let reviewsHtml = `<div class="review-wrapper mt-3">`;
		if (reviews && reviews.length > 0) {	
			reviews.reverse().forEach((review) => {
				reviewsHtml += `<div class="review-item mb-5"><div class="d-flex flex-row justify-content-between"><h5 class="reviewer-name m-0 mb-2">${review.reviewer}</h5><span class="small review-date">${this.timeSince(review.date)}</span></div>`;
				reviewsHtml += this.getStarRatingHtml(review.rating);
				reviewsHtml += `<p class="mt-3">${review.comment}</p></div>`
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


// 


// $(function() {
//     $('#readMore').click(function() { 
//      $(this).text(function(i,def) {
//         return def=='Read More' ?  'Show Less' : 'Read More';
//     });
// })

// });



