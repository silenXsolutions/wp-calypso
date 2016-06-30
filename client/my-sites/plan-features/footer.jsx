/**
 * External dependencies
 */
import { localize } from 'i18n-calypso';
import noop from 'lodash/noop';
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Gridicon from 'components/gridicon';
import classNames from 'classnames';

const PlanFeaturesFooter = ( {
	available = true,
	current = false,
	description,
	onUpgradeClick = noop,
	translate
} ) => {
	const classes = classNames( 'plan-features__footer', { 'has-description': !! description } );

	return (
		<footer className={ classes }>
			{ description && <p className="plan-features__footer-desc">{ description }</p> }
			<div className="plan-features__footer-buttons">
				{
					current
						? <Button className="plan-features__footer-button is-current" disabled>
							<Gridicon size={ 18 } icon="checkmark" />
							{ translate( 'Your plan' ) }
						</Button>
						: <Button className="plan-features__footer-button" {
							...( available
								? { onClick: onUpgradeClick, primary: true }
								: { disabled: true } ) }>
							{ translate( 'Upgrade' ) }
						</Button>
				}
			</div>
		</footer>
	);
};

PlanFeaturesFooter.propTypes = {
	current: PropTypes.bool,
	available: PropTypes.bool,
	description: PropTypes.string,
	onUpgradeClick: PropTypes.func
};

export default localize( PlanFeaturesFooter );
