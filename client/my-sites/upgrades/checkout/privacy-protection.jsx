/**
 * External dependencies
 */
const React = require( 'react' );

/**
 * Internal dependencies
 */
const cartItems = require( 'lib/cart-values' ).cartItems,
	PrivacyProtectionDialog = require( './privacy-protection-dialog' ),
	Card = require( 'components/card' ),
	Gridicon = require( 'components/gridicon' );

module.exports = React.createClass( {
	displayName: 'PrivacyProtection',

	handleDialogSelect: function( options, event ) {
		event.preventDefault();
		this.props.onDialogSelect( options );
	},

	handleButtonSelect: function( options, event ) {
		event.preventDefault();
		this.props.onButtonSelect( options );
	},

	handleDialogOpen: function() {
		this.props.onDialogOpen();
	},

	handleDialogClose: function() {
		this.props.onDialogClose();
	},

	getDomainRegistrations: function() {
		return cartItems.getDomainRegistrations( this.props.cart );
	},

	getFirstDomainToRegister: function() {
		const domainRegistration = this.getDomainRegistrations().shift();

		return domainRegistration.meta;
	},

	hasDomainPartOfPlan: function() {
		const cart = this.props.cart;
		return cart.has_bundle_credit || cartItems.hasPlan( cart );
	},

	getNumberOfDomainRegistrations: function() {
		return this.getDomainRegistrations().length;
	},

	getPrivacyProtectionCost: function() {
		const products = this.props.productsList.get();

		return products.private_whois.cost_display;
	},

	render: function() {
		const numberOfDomainRegistrations = this.getNumberOfDomainRegistrations(),
			hasOneFreePrivacy = this.hasDomainPartOfPlan() && numberOfDomainRegistrations === 1,
			privacyText = this.translate(
				"Privacy Protection hides your personal information in your domain's public records, to protect your identity and prevent spam."
			),
			freeWithPlan = hasOneFreePrivacy &&
						<span className="checkout__privacy-protection-free-text">
							{ this.translate( 'Free with your plan' ) }
						</span>;

		return (
			<div>
				<Card className="checkout__privacy-protection-checkbox">
					<input type="checkbox" onChange={ this.props.onCheckboxChange } checked={ this.props.isChecked } />
					<div className="privacy-protection-checkbox__description">
						<strong className="checkout__privacy-protection-checkbox-heading">
							{ this.translate( 'Please keep my information private.', { textOnly: true } ) }
						</strong>
						<p className={ 'checkout__privacy-protection-price-text' }>
							<span className={ ( hasOneFreePrivacy && 'free-with-plan' ) }>
								{
									this.translate(
										'%(cost)s per year',
										'%(cost)s per domain per year',
										{
											args: { cost: this.getPrivacyProtectionCost() },
											count: numberOfDomainRegistrations
										}
									)
								}
							</span>
							{ freeWithPlan }
						</p>
						<p className="checkout__privacy-protection-checkbox-text">{ privacyText }</p>
						<a href="" onClick={ this.handleDialogOpen }>Learn more about Privacy Protection.</a>
					</div>
					<div>
						<Gridicon icon="lock" size={ 48 } />
					</div>
				</Card>
				<PrivacyProtectionDialog
					disabled={ this.props.disabled }
					domain={ this.getFirstDomainToRegister() }
					cost={ this.getPrivacyProtectionCost() }
					countriesList={ this.props.countriesList }
					fields={ this.props.fields }
					isVisible={ this.props.isDialogVisible }
					onSelect={ this.handleDialogSelect }
					onClose={ this.handleDialogClose } />
			</div>
		);
	}
} );
