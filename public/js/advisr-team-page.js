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

		this.render(this.advisrBrokerageWithBrokersAndReviews.data, this.teamMembers, this.advisrBrokersConfig);
	}

	sanitiseTeamMember(item) {
		// return only used properties
		return {
			id: item.id || '',
			name: item.name || '',
			avatar_url: item.avatar_url || 'https://d3euw9n7vkdwcc.cloudfront.net/tenantfa80d915-b3e8-4d6a-ac85-64abd7999c14/users/default-user.webp', // @TODO replace this further up the chain
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

		function isJson(str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		}

		if (!isJson(advisrBrokersConfig)) {
			advisrBrokersConfig = [];
			advisrBrokerageWithBrokersAndReviews.brokers.forEach(function(broker, index) {
				let brokerTempOrder = {};
				brokerTempOrder.id = 'advisr-order-' + broker.id;
				brokerTempOrder.value = index + 1;
				advisrBrokersConfig.push(brokerTempOrder);
			});
		} else {
			advisrBrokersConfig = JSON.parse(advisrBrokersConfig);
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
						membersHtml += `<div class="advisr-prefix-class team-member-card 1 card h-100 text-center">`;
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
			
			let ratingHtml= ` `;
			let ratingtoal= 0;
	
			const rating = member.rating;
				for (var i = 0; i < rating; i++) {
					ratingHtml += `<li class="advisr-prefix-class list-inline-item m-0 mr-1"><span class="fa fa-star text-warning"></span> </li>`;
					//ratingtoal+=rating;
				}
				for (var j = rating; j < 5; j++) {
					ratingHtml += `<li class="advisr-prefix-class list-inline-item m-0 mr-1"><span class="fa fa-star-o"></span></li>`;
					//ratingtoal+=rating;
				}
				let reviews = member.reviews;
						for (var i = 0; i < reviews.length; i++) {
				//console.log(reviews[i].rating);
    ratingtoal += reviews[i].rating << 0;
}

const reviewsCount = reviews.length ? `(${reviews ? reviews.length : 0} ${reviews.length === 1 ? 'review' : 'reviews'})` : ''
const reviewsCount2 = reviews.length;				
const rating_avg=ratingtoal/reviewsCount2;
const reviewHTML = member.rating ? `<p>${ratingHtml} <span>${reviewsCount}</span></p>` : '';
const enquireHtml = member.id ? `<a data-id="${member.id}" id="modalmassageButton" data-bs-toggle="modal" data-bs-target="#memberModal3" href="" class="advisr-prefix-class team-member-email btn btn-dark mb-3">Connect</a>`: '';
		membersHtml += imageHtml  +
			`<div class="advisr-prefix-class team-member-contact card-body">`
				+ nameHtml + roleHtml + mobileHTML + telephoneHTML +reviewHTML+
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
										<img id="modalAvatar" src="https://d3euw9n7vkdwcc.cloudfront.net/tenantfa80d915-b3e8-4d6a-ac85-64abd7999c14/users/default-user.webp" class="advisr-prefix-class image img-fluid embed-responsive-item">	
									</div>
								</div>
								<div class="advisr-prefix-class team-member__modal-card-col col-sm-6 col-md-7 col-lg-9">
									<div class="advisr-prefix-class team-member__modal-card-body card-body">
										<h4 id="modalName" class="advisr-prefix-class text-black"></h4>
										<p id="modalRole" class="advisr-prefix-class text-muted fw-bold medium"></p>
										<p><a id="modalMobile" href="" class="advisr-prefix-class card-text text-muted small"></a></p>
										<p><a id="modalTelephone" href="" class="advisr-prefix-class card-text text-muted small"></a></p>
										<span class="advisr-prefix-class d-flex flex-row flex-gap mb-1">
											<p id="modalReviewSummary" class="mt-1"></p>
											<small id="modalReviewsCount" class="advisr-prefix-class ml-1 text-muted"></small>
										</span>
										<a id="modalmassageButton" data-bs-toggle="modal" data-bs-target="#memberModal3"  href="" class=" advisr-prefix-class btn btn-dark my-1 pop_connect_btn">Connect</a>
										<a id="modalReviewButton" data-bs-toggle="modal" data-bs-target="#memberModal2" href="" class="advisr-prefix-class btn btn-dark my-1 mx-2 write_a_review">Write a Review</a>
									</div>
								</div>
							 </div>
						</div>
						<div class="advisr-prefix-class team-member__modal-description modal-body">
							<div class="advisr-prefix-class team-member__modal-description-row row g-0 m-0">
								<div class="advisr-prefix-class team-member__modal-description-col col-lg-12 mb-1">
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
			
		
	
			membersHtml +=
				`<div class="advisr-prefix-class team-member__modal-container modal fade" id="memberModal2" tabindex="-1" aria-labelledby="memberModalLabel" aria-hidden="true">
				<div class="advisr-prefix-class team-member__modal-dialog modal-dialog modal-lg modal-dialog-centered">
					<div class="advisr-prefix-class team-member__modal-content modal-content">
						<div class="advisr-prefix-class close_button team-member__modal-header modal-header border-0 pb-0">
							<button type="button" class="advisr-prefix-class btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="advisr-prefix-class thank_you team-member__modal-body modal-body pt-2 pb-0">
							<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
								<div class="advisr-prefix-class heading team-member__modal-col ">
									<h4>Write a Review</h4>
								</div>
								<div class="advisr-prefix-class team-member__modal-card-col ">
									<div class="advisr-prefix-class team-member__modal-card-body card-body">
										
										<form method="post" id="submit_review">
				<div class="rating_div"><label style="float: left; ">Rating:	</label>		
<div class="rating">
<input type="radio" class="star_input" id="starValue5" name="starValue" value="5" />
 <label for="starValue5"></label>
 <input type="radio" class="star_input" id="starValue4" name="starValue" value="4" />
  <label for="starValue4"></label>
<input type="radio" class="star_input" id="starValue3" name="starValue" value="3" />
 <label for="starValue3"></label>
<input type="radio" class="star_input" id="starValue2" name="starValue" value="2" />
<label for="starValue2"></label>
<input type="radio" class="star_input" id="starValue1" name="starValue" value="1" /></label>
  <label for="starValue1"></label>

</div> 
	<br><span class="rating_error error"></span>
</div>
										<div class="filed_custo_all">
										<div class="filed_custom"><label>YOUR NAME <span>*</span></label><input type="text" name="reivewer_name" class="customfiled user_name">
										<span class="user_name error"></span></div>
										<div class="filed_custom">	<label>YOUR EMAIL ADDRESS <span>*</span> </label><input type="text" name="reivewer_email" class="customfiled email_user" >
										<span class="email_user error"></span></div>
										</div>
										<div class="text_area"><label> YOUR REVIEW <span>*</span></label> <textarea rows="5" name="reivewer_comment" class="customfiled comment_user"></textarea >
										<span class="comment_user error"></span></div>
							               <input type="hidden" value="" name="reviewee_id" class="customfiled reviewee_id" >
										
									<div class="submit_button"><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" name="submit_review" class="advisr-prefix-class btn btn-dark my-1 mx-2" value="Submit"></div></div>
										</form>
									</div>
								</div>
							 </div>
						</div>
						
						
					</div>
				</div>
			</div>`;
			
			membersHtml +=
				`<div class="advisr-prefix-class team-member__modal-container modal fade" id="memberModal3" tabindex="-1" aria-labelledby="memberModalLabel" aria-hidden="true">
				<div class="advisr-prefix-class team-member__modal-dialog modal-dialog modal-lg modal-dialog-centered">
					<div class="advisr-prefix-class team-member__modal-content modal-content">
						<div class="advisr-prefix-class close_button team-member__modal-header modal-header border-0 pb-0" style="display: block !important;">
							<button type="button" class="advisr-prefix-class btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div class="advisr-prefix-class drop_massage team-member__modal-body modal-body pt-2 pb-0">
							<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
								<div class="advisr-prefix-class team-member__modal-col ">
									<h4 class="center">Drop us a message</h4>
									<p class="center">Find the right solution</p>
								</div>
								<div class="advisr-prefix-class team-member__modal-card-col ">
									<div class="advisr-prefix-class team-member__modal-card-body card-body">
										
										<form method="post" id="submit_massage">
				
										<div class="filed_custo_all">
										<div class="filed_custom"><input type="text" name="first_name" placeholder="First Name" class="customfiled first_name">
										<span class="first_name error"></span></div>
										<div class="filed_custom">	<input type="text" name="last_name" placeholder="Last Name" class="customfiled last_name" >
										<span class="last_name error"></span></div>
										</div>
										<div class="filed_custo_all">
										<div class="filed_custom"><input type="text" name="email_address" placeholder="Email Address" class="customfiled email_address">
										<span class="email_address error"></span></div>
										<div class="filed_custom">	<input type="text" name="phone_number" maxlength="15" placeholder="Phone Number" class="customfiled phone_number" >
										<span class="phone_number error"></span></div>
										</div>
										<div class="text_area"><textarea rows="5" name="user_comment"  placeholder="Hi there, I would like help with insurance for.." class="customfiled comment_user_msg"></textarea >
										<span class="comment_user_msg error"></span></div>
							              <input type="hidden" value="" name="reviewee_id" id="reviewee_id" class="customfiled" >
										
									<div class="submit_button"><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" name="submit_massage" class="advisr-prefix-class btn btn-dark my-1 mx-2" value="Submit"></div></div>
										</form>
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

			
			//jQuery('.rating label').click(function() {
		jQuery(document).on("click",".thank_you .rating label",function(e) {
		jQuery('.rating label').removeClass('active');
		jQuery(this).addClass('active');
  });

 
		 jQuery(".thank_you").on("click","button.review_okay", function(e){
			 //location.reload();
			  	//jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","800px");
			 jQuery("#memberModal2 button.advisr-prefix-class.btn-close").trigger("click");
		 });
		jQuery("#memberModal").on("click","a#modalReviewButton", function(e){
		
				if(jQuery(".thank_you").hasClass("authenticate_review")){
					jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
				}else{
					jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","800px");
				}
			if(jQuery(this).hasClass("active")){
			
				jQuery("#memberModal2 .advisr-prefix-class.close_button.team-member__modal-header").show();
				var pophtml=`<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
								<div class="advisr-prefix-class heading team-member__modal-col ">
									<h4>Write a Review</h4>
								</div>
								<div class="advisr-prefix-class team-member__modal-card-col ">
									<div class="advisr-prefix-class team-member__modal-card-body card-body">
										<form method="post" id="submit_review">
				<div class="rating_div"><label style="float: left; ">Rating:	</label>		
				<div class="rating">
				<input type="radio" class="star_input" id="starValue5" name="starValue" value="5" />
 <label for="starValue5"></label>
 <input type="radio" class="star_input" id="starValue4" name="starValue" value="4" />
  <label for="starValue4"></label>
<input type="radio" class="star_input" id="starValue3" name="starValue" value="3" />
 <label for="starValue3"></label>
<input type="radio" class="star_input" id="starValue2" name="starValue" value="2" />
<label for="starValue2"></label>
<input type="radio" class="star_input" id="starValue1" name="starValue" value="1" /></label>
  <label for="starValue1"></label>

				</div>
					<br><span class="rating_error error"></span>
				</div>
										<div class="filed_custo_all">
										<div class="filed_custom"><label>YOUR NAME <span>*</span></label><input type="text" name="reivewer_name" class="customfiled user_name">
										<span class="user_name error"></span></div>
										<div class="filed_custom">	<label>YOUR EMAIL ADDRESS <span>*</span> </label><input type="text" name="reivewer_email" class="customfiled email_user" >
										<span class="email_user error"></span></div>
										</div>
										<div class="text_area"><label> YOUR REVIEW <span>*</span></label> <textarea rows="5" name="reivewer_comment" class="customfiled comment_user"></textarea >
										<span class="comment_user error"></span></div>
							               <input type="hidden" value="" name="reviewee_id" class="customfiled reviewee_id" >
										
									<div class="submit_button"><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" name="submit_review" class="advisr-prefix-class btn btn-dark my-1 mx-2" value="Submit"></div></div>
										</form>
									</div>
								</div>
							 </div>`;
							 
			if(jQuery(".thank_you").hasClass("new_reivews")){
			}else{
				jQuery(".thank_you").removeClass("active");
						jQuery(".thank_you").html(pophtml);
			}
			var dataid=jQuery(".thank_you").attr("data-id");
				jQuery(".reviewee_id").val(dataid);
			}
			  jQuery(this).addClass("active");
			   
		  });
		
		/*  jQuery("div#memberModal2").on("click",function(){

  if(jQuery("div#memberModal2").hasClass("show")){
console.log("if");
}else{
console.log("else");
 jQuery("button.advisr-prefix-class.btn-close").trigger("click");
}

});
	 */	 jQuery(".thank_you .user_name ").keypress(function(){
			  jQuery("input.user_name").removeClass("input_error");
jQuery(".user_name.error").html(' ');
});	
 jQuery(".thank_you .comment_user").keypress(function(){
	 jQuery("textarea.comment_user").removeClass("input_error");
jQuery(".comment_user.error").html(' ');
});	 
jQuery(".thank_you .email_user ").keypress(function(){
	jQuery("input.email_user").removeClass("input_error");
jQuery(".email_user.error").html(' ');
});
/* jQuery(".thank_you  #authenticate_form .email_user ").keypress(function(){
jQuery("#authenticate_form .email_user.error").html(' ');
}); */
 jQuery(".thank_you").on("keypress","#authenticate_form .email_user", function(e){
	 jQuery("#authenticate_form .email_user").removeClass("input_error");
jQuery("#authenticate_form .email_user.error").html(' ');
});
 jQuery(".thank_you").on("submit","#authenticate_form", function(e){
	 	jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
	  e.preventDefault();
	   var email_user= jQuery("#authenticate_form .email_user").val();
	   if (email_user.length < 1) {	
	    jQuery("#authenticate_form .email_user").addClass("input_error");
      jQuery('#authenticate_form .email_user.error').html('Please enter your email address.');
    } else {
 
	 var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
      var validEmail = pattern.test(email_user);
      if (!validEmail) {
		  jQuery("#authenticate_form .email_user").addClass("input_error");
        jQuery('#authenticate_form .email_user.error').html('Please enter a valid email address.');
      }else{
		  jQuery("#authenticate_form .email_user").removeClass("input_error");
		  jQuery('#authenticate_form.email_user.error').html(' ');
		    jQuery('#authenticate_form .email_user.error').html(' ');
	  }
    }
	 if (email_user.length > 1 && validEmail) {
		/// alert("ddd");
	jQuery('.thank_you #submit_review').trigger('submit');
	 }
	   return false;
 })

   /// jQuery("#memberModal2 .thank_you #submit_review").on("submit", function(e){
		jQuery(document).on("submit",".thank_you #submit_review",function(e) {
		  // var user_name= jQuery(".user_name").val();
		 //  alert("fff");
    e.preventDefault();
        var ajaxurl= jQuery("#ajax_url").val();
        var user_name= jQuery(".user_name").val();
        var email_user= jQuery(".email_user").val();
        var comment_user= jQuery(".comment_user").val();
        var reviewee_id= jQuery(".reviewee_id").val();
        var rating= jQuery(".rating_div .rating input:checked").val();
		//alert(rating);
		var name=jQuery("#modalName").html();
		
			 if( typeof rating === 'undefined') {
			
      jQuery('.rating_error.error').html('Please leave '+name+' a star rating.');
    }else{
		 jQuery('.rating_error.error').html(' ');
	}
		 if (user_name.length < 1) {
		jQuery("input.user_name").addClass("input_error");
      jQuery('.user_name.error').html('Please enter your name.');
    }else{
		jQuery("input.user_name").removeClass("input_error");
		 jQuery('.user_name.error').html(' ');
	}
	 if (comment_user.length < 1) {
		 jQuery("textarea.comment_user").addClass("input_error");
      jQuery('.comment_user.error').html('Please enter review.');
    }else{
		jQuery("textarea.comment_user").removeClass("input_error");
		 jQuery('.comment_user.error').html(' ');
	}
    if (email_user.length < 1) {	
	jQuery("input.email_user").addClass("input_error");
      jQuery('.email_user.error').html('Please enter your email address.');
    } else {
     var regEx = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/;
	 var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
      var validEmail = pattern.test(email_user);
      if (!validEmail) {
		  jQuery("input.email_user").addClass("input_error");
        jQuery('.email_user.error').html('Please enter a valid email address.');
      }else{
		  jQuery("input.email_user").removeClass("input_error");
		  jQuery('.email_user.error').html(' ');
	  }
    }
	
		 if (email_user.length > 1 && user_name.length > 1 && comment_user.length > 1 && validEmail &&  rating >= 1) {
			 var form_data = new FormData(); 
				form_data.append('user_name', user_name);
				form_data.append('email_user', email_user);
				form_data.append('rating', rating);
				form_data.append('comment_user', comment_user);
				form_data.append('reviewee_id', reviewee_id);
				form_data.append('action', 'save_review_custom_pop');
				
			  if(rating > 3){
				  jQuery(".submit_button span#submit-review-spinner").show();
				  	 jQuery(".submit_button input.advisr-prefix-class.btn").attr("disabled","disabled");
				jQuery.ajax({
				url : ajaxurl,
				dataType: 'text',  
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,                         
				type: 'post',
					success : function(data) {
						if(data =='Done'){
						///console.log("ddd")
						jQuery(".submit_button input.advisr-prefix-class.btn").attr("disabled",false);
						 jQuery(".submit_button span#submit-review-spinner").hide();
						jQuery(".close_button").hide();
						jQuery(".thank_you").addClass("renew");
						jQuery(".thank_you").addClass("active");
							jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
						jQuery(".thank_you").html('<h2>Thank you for your review</h2><button type="button" class="review_okay btn-dark" data-bs-dismiss="modal" aria-label="Okay">Okay</button>');
							/* if(jQuery(".thank_you").hasClass("new_reivews")){
							   jQuery(".thank_you").html('<h2>Thank you for your review</h2> <br><p>To ensure your review is genuine we need you to confirm your email address</p><form method="post"> <div class="email_custom"><label>YOUR EMAIL ADDRESS <span>*</span> </label><input type="email" required name="reivewer_email" class="customfiled " ></div><div><input type="submit" class="review_okay" value="Authenticate my email"><p>Please check your email account for an email from us</p><br><br></div></form>');

							} */
						}
					}
				});
  }else{
						jQuery(".policy_text").html(" ");
					
						jQuery(".thank_you .heading").addClass("custom_reivews");
					jQuery(".thank_you .heading").html("<strong>Hi, it seems like you've had a bad experience with "+name+"</strong><p class='custom_text'>To help resolve your concerns, "+name+" will be given the opportunity to reply. if you'd like to change any part of your review you can do that here<p>")
				jQuery(".filed_custom").addClass("bad_reivews");
				jQuery(".submit_button input.advisr-prefix-class.btn").val("Yes, i want to submit this reivew");
				jQuery(".submit_button input.advisr-prefix-class.btn").after("<div class='policy_text'><p>By proceeding you agree to adhere to the <a target='_blank' href='https://advisr.com.au/page/advisr-review-guidelines'>Advisr Reviews Policy and terms of usage</a></p><div>");
				//jQuery(".customfiled").val('');
				jQuery(".error").html('');
				
								
				if(jQuery(".thank_you").hasClass("authenticate_review")){
					 jQuery("#authenticate_form span#submit-review-spinner").show();
					 jQuery(".submit_button input.advisr-prefix-class.btn").attr("disabled","disabled");
					 jQuery("#authenticate_form input.review_okay").attr("disabled","disabled");
						jQuery.ajax({
					url : ajaxurl,
					dataType: 'text',  
					cache: false,
					contentType: false,
					processData: false,
					data: form_data,                         
					type: 'post',
						success : function(data) {
							if(data =='Done'){
							//console.log("ddd")
							 jQuery("#authenticate_form span#submit-review-spinner").hide();
							  jQuery(".submit_button input.advisr-prefix-class.btn").attr("disabled",false);
							  jQuery("#authenticate_form input.review_okay").attr("disabled",false);
							jQuery(".close_button").hide();
							jQuery(".thank_you").addClass("active");
							jQuery(".thank_you").removeClass("new_reivews");
							jQuery(".thank_you").removeClass("authenticate_review");
							jQuery(".thank_you").addClass("renew");
								jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
							jQuery(".thank_you").html('<h2>Thank you for your review</h2><br><p>Please check your email account for an email form us</p><button type="button" class="review_okay btn-dark" data-bs-dismiss="modal" aria-label="Okay">Okay</button>');
						
							}
						}
					}); 
				}
				
				if(jQuery("#authenticate_form").hasClass("active")){
					console.log("active");
				}else{
					if(jQuery(".thank_you").hasClass("new_reivews")){
								jQuery(".close_button").hide();
								jQuery(".thank_you").addClass("active");
								jQuery(".thank_you").addClass("authenticate_review");
								jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
								jQuery("#memberModal2 .advisr-prefix-class.close_button.team-member__modal-header").show();
									   jQuery(".thank_you").append('<h2>Thank you for your review</h2> <br><p class="custom_text">To ensure your review is genuine we need you to confirm your email address</p><form method="post" id="authenticate_form" class="active"> <div class="email_custom"><label>YOUR EMAIL ADDRESS <span class="error">*</span> </label><input type="text" name="reivewer_email" class="customfiled email_user" value="'+email_user+'"><br><span class="email_user error"></span></div><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" class="review_okay btn-dark" value="Authenticate my email"><p>Please check your email account for an email from us</p><br><br></div></form>');
					jQuery(".thank_you .advisr-prefix-class.team-member__modal-row.row.g-0.m-0").hide();
					}
				}
				jQuery(".thank_you").addClass("new_reivews");
				
				
				}
		 }
	 
      return false;
    });
  
  
    /* massage drop*/
jQuery(".team-member-enquiry a#modalmassageButton").click(function(){
jQuery("#memberModal3 .advisr-prefix-class.team-member__modal-dialog").css("max-width","800px");
jQuery("#memberModal3 .advisr-prefix-class.close_button.team-member__modal-header").show();
	 var html_drop= `<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
		<div class="advisr-prefix-class team-member__modal-col ">
			<h4 class="center">Drop us a message</h4>
			<p class="center">Find the right solution</p>
		</div>
		<div class="advisr-prefix-class team-member__modal-card-col ">
			<div class="advisr-prefix-class team-member__modal-card-body card-body">
				
				<form method="post" id="submit_massage">
		
				<div class="filed_custo_all">
				<div class="filed_custom"><input type="text" name="first_name" placeholder="First Name" class="customfiled first_name">
				<span class="first_name error"></span></div>
				<div class="filed_custom">	<input type="text" name="last_name" placeholder="Last Name" class="customfiled last_name" >
				<span class="last_name error"></span></div>
				</div>
				<div class="filed_custo_all">
				<div class="filed_custom"><input type="text" name="email_address" placeholder="Email Address" class="customfiled email_address">
				<span class="email_address error"></span></div>
				<div class="filed_custom">	<input type="text" name="phone_number" maxlength="15" placeholder="Phone Number" class="customfiled phone_number" >
				<span class="phone_number error"></span></div>
				</div>
				<div class="text_area"><textarea rows="5" name="user_comment"  placeholder="Hi there, I would like help with insurance for.." class="customfiled comment_user_msg"></textarea >
				<span class="comment_user_msg error"></span></div>
				<br>
				<div class="filed_custom" style=" width: 100%;"><label>  <input type="checkbox" value="yes" name="terms_condition" id="terms_condition" class="customfiled" > I agree to the <a href="https://advisr.com.au/page/terms-and-conditions"> Terms and Conditions. </a></label> 
				<span class="terms_condition error"></span> </div> <input type="hidden" value="" name="reviewee_id" id="reviewee_id" class="customfiled" >
				 
			<div class="submit_button"><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" name="submit_massage" class="advisr-prefix-class btn btn-dark my-1 mx-2" value="Submit"></div></div>
				</form>
			</div>
		</div>
		</div>`;
	jQuery(".drop_massage").html(html_drop);
	var user_id=jQuery(this).attr("data-id");
	jQuery("#reviewee_id").val(user_id);
  })
	jQuery(document).on("submit","#submit_massage",function(e) {
	// var user_name= jQuery(".user_name").val();
	//  alert("fff");
    e.preventDefault();
        var ajaxurl= jQuery("#ajax_url").val();
        var first_name= jQuery(".first_name").val();
        var last_name= jQuery(".last_name").val();
        var email_user= jQuery(".email_address").val();
        var phone_number= jQuery(".phone_number").val();
        var comment_user_msg= jQuery("#submit_massage .comment_user_msg").val();
		
        var reviewee_id= jQuery("#reviewee_id").val();
		
		if (jQuery('input#terms_condition').is(':checked')) {
        var terms_condition= jQuery("#terms_condition").val();
		}else{
			 var terms_condition=" "
		}
		
		 if (first_name.length < 1) {
		jQuery("input.first_name").addClass("input_error");
      jQuery('.first_name.error').html('Please enter your First Name.');
    }else{
		jQuery("input.first_name").removeClass("input_error");
		 jQuery('.first_name.error').html(' ');
	}
	if (last_name.length < 1) {
		jQuery("input.last_name").addClass("input_error");
      jQuery('.last_name.error').html('Please enter your Last Name.');
    }else{
		jQuery("input.last_name").removeClass("input_error");
		 jQuery('.last_name.error').html(' ');
	}
	if (terms_condition =='yes') {
		jQuery("input#terms_condition").removeClass("input_error");
		 jQuery('.terms_condition.error').html(' ');
    }else{
		jQuery("input#terms_condition").addClass("input_error");
      jQuery('.terms_condition.error').html('Please fill checkbox terms conditions.');
		
	}
	if (phone_number.length < 1) {
		jQuery("input.phone_number").addClass("input_error");
		jQuery('.phone_number.error').html('Please enter your phone number.');
		var phone_valid=' ';
    } else {
  		//var phoneNum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
		var phoneNum = /^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/;
		if(phone_number.match(phoneNum)) {
			jQuery("input.phone_number").removeClass("input_error");
			jQuery('.phone_number.error').html(' ');
			var phone_valid='true';
		} else {
			jQuery("input.phone_number").addClass("input_error");
			jQuery('.phone_number.error').html('Please enter a valid phone number.');
			var phone_valid=' ';
		}

	}
	
	 if (comment_user_msg.length < 1) {
		jQuery("textarea.comment_user_msg").addClass("input_error");
		jQuery('.comment_user_msg.error').html('Please enter a reason.');
    } else {
		jQuery("textarea.comment_user_msg").removeClass("input_error");
		jQuery('.comment_user_msg.error').html(' ');
	}
    if (email_user.length < 1) {	
		jQuery("input.email_address").addClass("input_error");
		jQuery('.email_address.error').html('Please enter your email address.');
    } else {
		var regEx = /^[A-Z0-9][A-Z0-9._%+-]{0,63}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/;
		var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
		var validEmail = pattern.test(email_user);
		if (!validEmail) {
			jQuery("input.email_address").addClass("input_error");
			jQuery('.email_address.error').html('Please enter a valid email address.');
		} else {
		  jQuery("input.email_address").removeClass("input_error");
		  jQuery('.email_address.error').html(' ');
		}
    }
	
	 if (email_user.length > 1 && first_name.length > 1 && last_name.length > 1 && terms_condition =='yes' && comment_user_msg.length > 1 && validEmail && phone_valid =='true' ) {
		 var form_data = new FormData();
			form_data.append('first_name', first_name);
			form_data.append('last_name', last_name);
			form_data.append('email_user', email_user);
			form_data.append('phone_number', phone_number);
			form_data.append('comment_user', comment_user_msg);
			form_data.append('reviewee_id', reviewee_id);
			form_data.append('action', 'save_massage_drop_user_custom_pop');

		 jQuery("#submit_massage .submit_button span#submit-review-spinner").show();
		 jQuery("#submit_massage .submit_button input.advisr-prefix-class.btn").attr("disabled","disabled");
			jQuery.ajax({
			url : ajaxurl,
			dataType: 'text',
			cache: false,
			contentType: false,
			processData: false,
			data: form_data,
			type: 'post',
				success : function(data) {
					//console(data);
					if(data =='Done'){
					jQuery("#submit_massage .submit_button input.advisr-prefix-class.btn").attr("disabled",false);
					 jQuery("#submit_massage .submit_button span#submit-review-spinner").hide();
						jQuery("#memberModal3 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
					   jQuery(".drop_massage").html('<div class="successful"><p>Enquiry sent successfully</p><button type="button" class="review_okay btn-dark" data-bs-dismiss="modal" aria-label="Okay">Okay</button></div>');


					}
				}
			});
	}

      return false;
    });
	 
  /* end massage drop*/
			let memberModal = document.getElementById('memberModal')
			memberModal.addEventListener('show.bs.modal', function (event) {
				// Button that triggered the modal
				let button = event.relatedTarget;
				// Extract info from data-bs-* attributes
				let selected = button.getAttribute('data-bs-selected');
				let avatar = mergedTeamMembers[selected].avatar_url;
				let name = mergedTeamMembers[selected].name;
				let id = mergedTeamMembers[selected].id;
				let role = mergedTeamMembers[selected].role;
				let mobile = mergedTeamMembers[selected].mobile;
				let telephone = mergedTeamMembers[selected].telephone;
				let rating = mergedTeamMembers[selected].rating;
				let ratingHtml = rating ? getStarRating(rating) : '';
				let reviews = mergedTeamMembers[selected].reviews;
				let reviewsCount = reviews.length ? `(${reviews ? reviews.length : 0} ${reviews.length === 1 ? 'review' : 'reviews'})` : ''
				let profileURL = mergedTeamMembers[selected].profile_url;
                let ratingtoal=0;
				let reviewsCount2=reviews.length;
				for (var i = 0; i < reviews.length; i++) {
				ratingtoal += reviews[i].rating << 0;
				}  	
				const rating_avg=ratingtoal/reviewsCount2;	
				   
				   if(id ==''){
					   jQuery(".write_a_review").hide();
					    jQuery(".pop_connect_btn").hide();
					   
				   }else{
					     jQuery(".write_a_review").show();
					     jQuery(".pop_connect_btn").show();
				   }
				 	jQuery("#memberModal3 .advisr-prefix-class.team-member__modal-dialog").css("max-width","800px");
				   	jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","800px");
					jQuery(".thank_you").removeClass("new_reivews");
					jQuery("a#modalReviewButton").removeClass("active");
					jQuery(".thank_you .rating label").removeClass("active");
					jQuery(".thank_you .heading").html("<h4>Write a Review</h4>");
				jQuery(".filed_custom").removeClass("bad_reivews");
					jQuery(".submit_button input.advisr-prefix-class.btn").val("Submit");
					jQuery(".policy_text").html(" ");
					jQuery(".customfiled").val('');
					jQuery(".error").html('');
					jQuery("#memberModal2 .advisr-prefix-class.close_button.team-member__modal-header").show();
					jQuery("input.user_name").removeClass("input_error");
					jQuery("input.email_user").removeClass("input_error");
					jQuery("textarea.comment_user ").removeClass("input_error");
				var pophtml=`<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
								<div class="advisr-prefix-class heading team-member__modal-col ">
									<h4>Write a Review</h4>
								</div>
								<div class="advisr-prefix-class team-member__modal-card-col ">
									<div class="advisr-prefix-class team-member__modal-card-body card-body">
										
										<form method="post" id="submit_review">
				<div class="rating_div"><label style="float: left; ">Rating:	</label>		
				<div class="rating">
				<input type="radio" class="star_input" id="starValue5" name="starValue" value="5" />
 <label for="starValue5"></label>
 <input type="radio" class="star_input" id="starValue4" name="starValue" value="4" />
  <label for="starValue4"></label>
<input type="radio" class="star_input" id="starValue3" name="starValue" value="3" />
 <label for="starValue3"></label>
<input type="radio" class="star_input" id="starValue2" name="starValue" value="2" />
<label for="starValue2"></label>
<input type="radio" class="star_input" id="starValue1" name="starValue" value="1" /></label>
  <label for="starValue1"></label>

				</div>
					<br><span class="rating_error error"></span>
				</div>
										<div class="filed_custo_all">
										<div class="filed_custom"><label>YOUR NAME <span>*</span></label><input type="text" name="reivewer_name" class="customfiled user_name">
										<span class="user_name error"></span></div>
										<div class="filed_custom">	<label>YOUR EMAIL ADDRESS <span>*</span> </label><input type="text" name="reivewer_email" class="customfiled email_user" >
										<span class="email_user error"></span></div>
										</div>
										<div class="text_area"><label> YOUR REVIEW <span>*</span></label> <textarea rows="5" name="reivewer_comment" class="customfiled comment_user"></textarea >
										<span class="comment_user error"></span></div>
							               <input type="hidden" value="" name="reviewee_id" class="customfiled reviewee_id" >
										
									<div class="submit_button"><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" name="submit_review" class="advisr-prefix-class btn btn-dark my-1 mx-2" value="Submit"></div></div>
										</form>
									</div>
								</div>
							 </div>`;
						if(jQuery(".thank_you").hasClass("authenticate_review")){
							jQuery("#memberModal2 .advisr-prefix-class.team-member__modal-dialog").css("max-width","600px");
						jQuery(".thank_you").html(pophtml);
						}if(jQuery(".thank_you").hasClass("renew")){
						jQuery(".thank_you").html(pophtml);
						}
						
				jQuery(".thank_you").removeClass("custom_reivews");
				jQuery(".thank_you").removeClass("renew");
				jQuery(".thank_you").removeClass("authenticate_review");
				jQuery(".thank_you").removeClass("active");
 
				
				 var html_drop= `<div class="advisr-prefix-class team-member__modal-row row g-0 m-0">
					<div class="advisr-prefix-class team-member__modal-col ">
						<h4 class="center">Drop us a message</h4>
						<p class="center">Find the right solution</p>
					</div>
					<div class="advisr-prefix-class team-member__modal-card-col ">
						<div class="advisr-prefix-class team-member__modal-card-body card-body">
							
							<form method="post" id="submit_massage">
	
							<div class="filed_custo_all">
							<div class="filed_custom"><input type="text" name="first_name" placeholder="First Name" class="customfiled first_name">
							<span class="first_name error"></span></div>
							<div class="filed_custom">	<input type="text" name="last_name" placeholder="Last Name" class="customfiled last_name" >
							<span class="last_name error"></span></div>
							</div>
							<div class="filed_custo_all">
							<div class="filed_custom"><input type="text" name="email_address" placeholder="Email Address" class="customfiled email_address">
							<span class="email_address error"></span></div>
							<div class="filed_custom">	<input type="text" name="phone_number" maxlength="15" placeholder="Phone Number" class="customfiled phone_number" >
							<span class="phone_number error"></span></div>
							</div>
							<div class="text_area"><textarea rows="5" name="user_comment"  placeholder="Hi there, I would like help with insurance for.." class="customfiled comment_user_msg"></textarea >
							<span class="comment_user_msg error"></span></div>
							 <br>
							 <div class="filed_custom" style=" width: 100%; "><label>  <input type="checkbox" value="yes" name="terms_condition" id="terms_condition" class="customfiled" > I agree to the <a href="https://advisr.com.au/page/terms-and-conditions"> Terms and Conditions. </a> </label> 
							<span class="terms_condition error"></span> </div>
							  <input type="hidden" value="" name="reviewee_id" id="reviewee_id" class="customfiled" >
							
						<div class="submit_button"><div class="loaderdiv"><span style="display: none;" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" id="submit-review-spinner"></span><input type="submit" name="submit_massage" class="advisr-prefix-class btn btn-dark my-1 mx-2" value="Submit"></div></div>
							</form>
						</div>
					</div>
				 </div>`;
				  jQuery(".drop_massage").html(html_drop);
				  
				 jQuery("#memberModal3 .advisr-prefix-class.close_button.team-member__modal-header").show();
				
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
				jQuery(".reviewee_id").val(id);
				jQuery("#reviewee_id").val(id);
				jQuery(".thank_you").attr("data-id",id);
                 //    jQuery(".thank_you input.customfiled.user_name").removeClass("input_error");
					//jQuery("#modalReviewButton").attr("href", profileURL);


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
					ratingHtml += `<li class="advisr-prefix-class list-inline-item m-0 mr-1"><span class="fa fa-star text-warning"></span> </li>`;
				}
				for (var j = rating; j < 5; j++) {
					ratingHtml += `<li class="advisr-prefix-class list-inline-item m-0 mr-1"><span class="fa fa-star-o"></span></li>`;
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
		const url = `https://advisr.com.au/api/v2/brokerages`;
		// const url = `https://advisr.advisrdev.com.au/api/v2/brokerages`;

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