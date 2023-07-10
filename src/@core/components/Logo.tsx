import * as React from 'react';
import { type SVGProps, memo } from 'react';

type Props = SVGProps<SVGSVGElement> & {
	logoWidth?: number;
	logoColor?: string;
	logoAccentColor?: string;
};
const Logo = (props: Props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={props.logoWidth || 512}
		viewBox={'0 0 512 327'}
		fill='none'
		{...props}>
		<path
			fill={props.logoColor || '#000'}
			fillRule='evenodd'
			d='M443.683 163.11C404.997 100.058 335.425 58 256.029 58c-79.518 0-149.182 42.187-187.832 105.4L41 150.399C84.584 77.11 164.571 28 256.029 28c91.336 0 171.232 48.98 214.855 122.108l-27.201 13.002Z'
			clipRule='evenodd'
		/>
		<path
			fill={props.logoColor || '#000'}
			fillRule='evenodd'
			d='m175.277 191.186-25.22.339c-.019.823-.028 1.648-.028 2.475 0 57.99 47.01 105 105 105s105-47.01 105-105-47.01-105-105-105c-1.915 0-3.818.051-5.707.153l1.717 25.145a81.205 81.205 0 0 1 3.99-.098c44.072 0 79.8 35.728 79.8 79.8 0 44.072-35.728 79.8-79.8 79.8-44.073 0-79.8-35.728-79.8-79.8 0-.942.016-1.88.048-2.814Z'
			clipRule='evenodd'
		/>
		<circle
			cx={255.638}
			cy={194}
			r={35}
			fill={props.logoAccentColor || props.logoColor || '#000'}
		/>
	</svg>
);
const Memo = memo(Logo);
export default Memo;
