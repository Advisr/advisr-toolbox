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
			name: item.name,
			avatar_url: item.avatar_url || 'https://advisr.com.au/storage/users/default.png', // @TODO replace this further up the chain
			mobile: item.mobile,
			role: item.role,
			profile_url: item.profile_url,
			telephone: item.telephone,
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

		template.innerHTML = `<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet"></link>`;

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
			.image {
				object-fit: cover;
			}
		</style>
		<div id='members-wrapper'></div>`;

		let fragment = document.importNode(template.content, true);

		let membersHtml = '';

		if (mergedTeamMembers && mergedTeamMembers.length > 0) {
			membersHtml += `<div class="container"><div class="row">`;
			mergedTeamMembers.forEach((member) => {
				membersHtml += `<div class="team-member-item col-12 col-sm-6 col-md-4 col-lg-3 mb-5">`;
				const imageHtml = member.avatar_url ? `<div class="team-member-image embed-responsive embed-responsive-1by1"><img src="${member.avatar_url}" class="image img-fluid embed-responsive-item"></div>` : '';
				const nameHtml = member.name ? `<div class="team-member-name"><h3 class="name">${member.name}</h3></div>` : '';
				const roleHtml = member.role ? `<div class="team-member-role"><p class="role">${member.role}</p></div>` : '';
				const mobileHtml = member.mobile ? `<div class="team-member-mobile"><p class="mobile"><i class="fa fa-mobile"></i>${member.mobile}</p></div>` : '';
				const telephoneHtml = member.telephone ? `<div class="team-member-telephone"><p class="telephone"><i class="fa fa-phone"></i>${member.telephone}</p></div>` : '';
				membersHtml += imageHtml  + nameHtml + roleHtml + mobileHtml + telephoneHtml;
				membersHtml += '</div>';
			})
			membersHtml += '</div></div>';
		} else {
			membersHtml = '<p>No brokers found.</p>';
		}

		fragment.querySelector('#members-wrapper').innerHTML = membersHtml;
		const component = document.querySelector('advisr-team-page');
		component.appendChild(fragment);

	}

	async fetchFromAdvisrApi(apikey) {
		const url = `https://advisr.com.au/api/v1/brokerages/4208?withBrokers=true&withReviews=true&recursiveReviews=true`;

		var myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${apikey}`);
		// myHeaders.append('Content-Type', 'application/json');
		// myHeaders.append('Accept', 'application/json');
		// myHeaders.append('Origin','http://localhost:8080');

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