/**
 * External dependencies
 */
var React = require( 'react' ),
	classNames = require( 'classnames' ),
	noop = require( 'lodash/utility/noop' );

/**
 * Internal dependencies
 */
var SiteIcon = require( 'components/site-icon' ),
	Gridicon = require( 'components/gridicon' ),
	SiteIndicator = require( 'my-sites/site-indicator' ),
	sites = require( 'lib/sites-list' )();

module.exports = React.createClass( {
	displayName: 'Site',

	getDefaultProps: function() {
		return {
			// onSelect callback
			onSelect: noop,
			onClick: noop,
			// mouse event callbacks
			onMouseEnter: noop,
			onMouseLeave: noop,

			// Set a href attribute to the anchor
			href: null,

			// Choose to show the SiteIndicator
			indicator: true,

			// Mark as selected or not
			isSelected: false,

			homeLink: false
		};
	},

	propTypes: {
		href: React.PropTypes.string,
		externalLink: React.PropTypes.bool,
		indicator: React.PropTypes.bool,
		onSelect: React.PropTypes.func,
		onMouseEnter: React.PropTypes.func,
		onMouseLeave: React.PropTypes.func,
		isSelected: React.PropTypes.bool,
		site: React.PropTypes.object.isRequired,
		onClick: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			showMoreActions: false
		};
	},

	onSelect: function( event ) {
		if ( this.props.homeLink ) {
			return;
		}

		this.props.onSelect( event );
		event.preventDefault(); // this doesn't actually do anything...
	},

	starSite: function() {
		const site = sites.getSelectedSite();
		sites.toggleStarred( site.ID );
	},

	renderStar: function() {
		const site = this.props.site;

		if ( ! site ) {
			return null;
		}

		const isStarred = sites.isStarred( site );

		return (
			<button className="site__star" onClick={ this.starSite }>
				{ isStarred
					? <Gridicon icon="star" />
					: <Gridicon icon="star-outline" />
				}
			</button>
		);
	},

	render: function() {
		var site = this.props.site,
			siteClass;

		if ( ! site ) {
			// we could move the placeholder state here
			return null;
		}

		siteClass = classNames( {
			site: true,
			'is-jetpack': site.jetpack,
			'is-primary': site.primary,
			'is-private': site.is_private,
			'is-redirect': site.options && site.options.is_redirect,
			'is-selected': this.props.isSelected,
			'is-toggled': this.state.showMoreActions
		} );

		return (
			<div className={ siteClass }>
				<a className="site__content"
					href={ this.props.homeLink ? site.URL : this.props.href }
					target={ this.props.externalLink && '_blank' }
					title={ this.props.homeLink
						? this.translate( 'Visit "%(title)s"', { args: { title: site.title } } )
						: site.title
					}
					onTouchTap={ this.onSelect }
					onClick={ this.props.onClick }
					onMouseEnter={ this.props.onMouseEnter }
					onMouseLeave={ this.props.onMouseLeave }
					aria-label={
						this.translate( 'Open site %(domain)s in new tab', {
							args: { domain: site.domain }
						} )
					}
				>
					<SiteIcon site={ site } />
					{ this.state.showMoreActions ?
						<div className="site__actions">
							<span className="site__edit-icon">Edit Icon</span>
							{ this.renderStar() }
						</div>
					:
						<div className="site__info">
							<div className="site__title">{ site.title }</div>
							<div className="site__domain">{ site.domain }</div>
						</div>
					}
					{ this.props.homeLink && ! this.state.showMoreActions &&
						<span className="site__home">
							<Gridicon icon="house" size={ 12 } />
						</span>
					}
				</a>
				{ this.props.indicator
					? <SiteIndicator site={ site } onSelect={ this.props.onSelect } />
					: null
				}
				<button
					className="site__toggle-more-options"
					onClick={ () => this.setState( { showMoreActions: ! this.state.showMoreActions } ) }
				>
					<Gridicon icon="ellipsis" size={ 24 } />
				</button>
			</div>
		);
	}
} );
