import React, { forwardRef } from 'react';
import { observer } from 'mobx-react';
import { I, S, U } from 'Lib';

interface Props {
	id?: string;
	icon?: string;
	size?: number;
	asImage?: boolean;
	className?: string;
	canEdit?: boolean;
};

const IconEmoji = observer(forwardRef<HTMLDivElement, Props>(({
	id = '',
	icon = '',
	size = 18,
	asImage = true,
	className = '',
	canEdit = false,
}, ref) => {

	const cn = [ 'iconEmoji', className ];
	const css: any = { lineHeight: `${size}px` };
	const mode = S.Common.emojiRenderMode;

	if (canEdit) {
		cn.push('canEdit');
	};

	let element = null;
	if (!icon) {
		return null;
	};

	const code = icon.match(':') ? icon : U.Smile.getCode(icon);

	if (mode === I.EmojiRenderMode.System) {
		// Render as plain unicode text using OS emoji fonts
		const native = code ? U.Smile.nativeFromColons(code) : icon;
		if (native) {
			element = (
				<span
					className={[ 'smileNative' ].join(' ')}
					style={{ fontSize: `${size}px`, fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
				>
					{native}
				</span>
			);
		};
	} else
	if (mode === I.EmojiRenderMode.Twemoji) {
		// Render using Twemoji CDN SVG assets
		const native = code ? U.Smile.nativeFromColons(code) : icon;
		const src = native ? U.Smile.toTwemojiUrl(native) : '';
		if (src) {
			element = (
				<img
					src={src}
					className={[ 'smileImage', `c${size}` ].join(' ')}
					onDragStart={e => e.preventDefault()}
					onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
						// Fall back to local PNG on error; disable handler to prevent loop
						const fallbackSrc = code ? U.Smile.srcFromColons(code) : '';
						if (!fallbackSrc || (e.currentTarget.src === fallbackSrc)) {
							return;
						};
						e.currentTarget.onerror = null;
						e.currentTarget.src = fallbackSrc;
					}}
				/>
			);
		};
	} else {
		// Default: use existing behavior (local PNG or em-emoji web component)
		if (code) {
			if (asImage) {
				element = (
					<img 
						src={U.Smile.srcFromColons(code)}
						className={[ 'smileImage', `c${size}` ].join(' ')}
						onDragStart={e=> e.preventDefault()}
					/>
				);
			} else {
				element = <em-emoji shortcodes={code}></em-emoji>;
			};
		};
	};

	if (!element) {
		return null;
	};

	return (
		<div id={id} style={css} className={cn.join(' ')}>
			{element}
		</div>
	);

}));

export default IconEmoji;