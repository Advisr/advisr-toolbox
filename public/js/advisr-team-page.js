class AdvisrTeamPage extends HTMLElement {
	constructor() {
		super();
		this.apiToken = '';
	}

	async connectedCallback() {
		if (!this.hasAttribute('api-token') || this.getAttribute('api-token') === "") {
			this.render({});
		}
console.log('hi', scriptParams);
		this.brokerWithReviews = await this.fetchFromAdvisrApi(this.getAttribute('api-token'));
		this.render(this.brokerWithReviews, this.getAttribute('show-review-link'), this.getAttribute('include-styles'));
	}

	render(brokerWithReviews, showReviewLink, includeStyles) {

		const reviews = brokerWithReviews.reviews;

		if (!reviews) {
			fragment.querySelector('#reviews-wrapper').innerHTML = 'Api token not provided.';
		}

		const template = document.createElement('template');

		template.innerHTML = '';

		if (includeStyles !== 'false') {
			template.innerHTML += `<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet"></link>`;
		}

		template.innerHTML += `
		<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"></link>
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
		</style>
		<div id='reviews-wrapper'></div>`;

		let fragment = document.importNode(template.content, true);

		let reviewsHtml = '';

		if (reviews && reviews.length > 0) {

			reviews.reverse().forEach((review) => {
				reviewsHtml += `<div class="review-item mb-3"><div class="d-flex flex-row justify-content-between"><h4 class="reviewer-name">${review.reviewer}</h4><span class="small review-date">${this.timeSince(review.date)}</span></div>`;
				let ratingHtml = `<ul class="list-inline small mb-1">`;
				for (var i = 0; i < review.rating; i++) {
					ratingHtml += `<li class="list-inline-item mx-0 mb-1"><span class="fa fa-star text-warning"></span> </li>`;
				}
				for (var j = review.rating; j < 5; j++) {
					ratingHtml += `<li class="list-inline-item mx-0"><span class="fa fa-star text-white"></span></li>`;
				}
				ratingHtml += `</ul>`;
				reviewsHtml += ratingHtml;
				reviewsHtml += `<p>${review.comment}</p></div>`
			})
		} else {
			reviewsHtml = 'No reviews.';
		}

		if (showReviewLink === "true") {
			reviewsHtml += `<div class="add-review"><a href="https://advisr.com.au/${brokerWithReviews.slug}#reviews" target="_blank">Leave ${brokerWithReviews.first_name} a review <i class="fa fa-external-link"></i></a></div>`
		}
		
		fragment.querySelector('#reviews-wrapper').innerHTML = reviewsHtml;

		const component = document.querySelector('advisr-reviews');
		component.appendChild(fragment);

		document.querySelector('advisr-reviews').removeAttribute('api-token');

	}

	async fetchFromAdvisrApi(apiToken) {
		const url = `https://advisr.com.au/api/v1/brokers/1?withReviews=true`;

		var myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${apiToken}`);

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

	timeSince(date) {
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
}

customElements.define('advisr-reviews', AdvisrTeamPage);