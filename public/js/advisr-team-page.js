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
				const roleHtml = member.role ? `<div class="team-member-role mb-2"><p class="role">${member.role}</p></div>` : '';
				const mobileHtml = member.mobile ? `<div class="team-member-mobile mb-2"><p class="mobile d-flex align-items-center"><i class="fa fa-mobile"></i>&nbsp;${member.mobile}</p></div>` : '';
				const telephoneHtml = member.telephone ? `<div class="team-member-telephone mb-2"><p class="telephone mobile d-flex align-items-center"><i class="fa fa-phone"></i>&nbsp;${member.telephone}</p></div>` : '';
				const launchModalHtml = member.id ? `<a href="#messageModal-${ member.id }" data-modal-target="#messageModal-${ member.id }" data-modal-effect="blur" data-modal-is-closing-by-esc="true" data-modal-is-closing-by-overlay="true">See more</a>` : '';
				membersHtml += imageHtml  + nameHtml + roleHtml + mobileHtml + telephoneHtml + launchModalHtml;
				membersHtml += '</div>';
				membersHtml += `<div id="messageModal-${ member.id }" class="js-modal-window u-modal-window">
								<div class="bg-light position-relative">
									<div class="container">
										<div class="row justify-content-center">
											<!-- Contact Form -->
											<form class="js-validate card p-5 confirm-send-message" id="{{$user->slug}}" method="POST" action="{{ route('lead.store') }}" onsubmit="document.getElementById('submit-lead-button-{{$user->slug}}').disabled = true;document.getElementById('submit-lead-spinner-{{$user->slug}}').classList.remove('d-none');">
												<div class="float-right">
													<button type="button" class="close" aria-label="Close" onclick="Custombox.modal.close();">
														<span aria-hidden="true">×</span>
													</button>
												</div>
												<div class="text-center mb-4">
													<h3 class="h4">Drop us a message</h3>
													<p>Find the right solution</p>
												</div>

												<div class="row mx-gutters-2">
													<input type="hidden" name="userId" value="{{ $user->id }}">
													<div class="col-md-6 mb-3">
														<!-- Input -->
														<label class="sr-only">First name</label>

														<div class="js-form-message">
															<div class="input-group">
																<input type="text" class="form-control" name="firstName" placeholder="First name" aria-label="First name" required
																	data-msg="Please enter your first name."
																	data-error-class="u-has-error"
																	data-success-class="u-has-success">
															</div>
														</div>
														<!-- End Input -->
													</div>

													<div class="col-md-6 mb-3">
														<!-- Input -->
														<label class="sr-only">Last name</label>

														<div class="js-form-message">
															<div class="input-group">
																<input type="text" class="form-control" name="lastName" placeholder="Last name" aria-label="Last name" required
																	data-msg="Please enter your last name."
																	data-error-class="u-has-error"
																	data-success-class="u-has-success">
															</div>
														</div>
														<!-- End Input -->
													</div>

													<div class="w-100"></div>

													<div class="col-md-6 mb-3">
														<!-- Input -->
														<label class="sr-only">Email address</label>

														<div class="js-form-message">
															<div class="input-group">
																<input type="text" class="form-control" name="email" id="email-field{{ $user->id }}" placeholder="Email address" aria-label="Email address" required
																	data-msg="Please enter a valid email address."
																	data-error-class="u-has-error"
																	data-success-class="u-has-success"
																	oninput="checkEmail('email-field{{ $user->id }}')">
															</div>
														</div>
														<!-- End Input -->
													</div>

													<div class="col-md-6 mb-3">
														<!-- Input -->
														<label class="sr-only">Phone number</label>

														<div class="js-form-message">
															<div class="input-group">
																<input type="text" class="form-control" name="phoneNumber" placeholder="Phone number"       aria-label="Company" required
																	data-msg="Please enter phone number."
																	data-error-class="u-has-error"
																	data-success-class="u-has-success">
															</div>
														</div>
														<!-- End Input -->
													</div>
												</div>

												<!-- Input -->
												<div class="mb-5">
													<label class="sr-only">How can we help you?</label>

													<div class="js-form-message input-group">
														<textarea class="form-control" rows="4" name="description" placeholder="Hi there, I would like help with insurance for..." aria-label="Hi there, I would like help with insurance for..." required
																data-msg="Please enter a reason."
																data-error-class="u-has-error"
																data-success-class="u-has-success"></textarea>
													</div>
												</div>
												<!-- End Input -->

												<!-- Checkbox -->
												<div class="js-form-message mb-3">
													<div class="custom-control custom-checkbox d-flex align-items-center text-muted">
														<input type="checkbox" class="custom-control-input" id="termsCheckbox{{ $user->id }}" name="termsCheckbox" required
															data-msg="Please accept our Terms and Conditions."
															data-error-class="u-has-error"
															data-success-class="u-has-success">
														<label class="custom-control-label" for="termsCheckbox{{ $user->id }}">
															<small>
																I agree to the
																<a class="link-muted" href="{{ config('app.url') }}/privacy-policy/#TermsAndConditions">Terms and Conditions</a>
															</small>
														</label>
													</div>
												</div>
												<!-- End Checkbox -->

												<!-- Checkbox -->
												<div class="js-form-message mb-5" id="subscription-section{{ $user->id }}">
													<div class="custom-control custom-checkbox d-flex align-items-center text-muted">
														<input type="checkbox" class="custom-control-input" id="newsletterCheckbox{{ $user->id }}" name="newsletterCheckbox" value="{{ HubSpotSubscriptionService::SUBSCRIPTION_ADVISR_NEWSLETTER }}">
														<label class="custom-control-label" for="newsletterCheckbox{{ $user->id }}">
															<small>I want to receive the Advisr Business Insights Newsletter</small>
														</label>
													</div>
												</div>
												<!-- End Checkbox -->

												<input type="hidden" name="recaptcha" id="recaptcha{{$user->id}}" value="">

												<button type="submit" class="btn btn-primary transition-3d-hover submit-lead" id="submit-lead-button-{{$user->slug}}">
													<span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true" id="submit-lead-spinner-{{$user->slug}}"></span>
													Submit
												</button>
											</form>
											<!-- End Contact Form -->
										</div>
									</div>
								</div>
							</div>`;
			})
			membersHtml += '</div></div>';
		} else {
			membersHtml = '<p>No brokers found.</p>';
		}

console.log(jQuery.fn.popover);
		fragment.querySelector('#members-wrapper').innerHTML = membersHtml;
		const component = document.querySelector('advisr-team-page');
		component.appendChild(fragment);

		// Initialise modal windows
		jQuery(document).ready(function () {
			jQuery.HSCore.components.HSModalWindow.init("[data-modal-target]", ".js-modal-window", { autonomous: true}); 
		})

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