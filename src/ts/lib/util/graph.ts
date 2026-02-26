import { I, S, U, J, Relation } from 'Lib';

/**
 * UtilGraph provides utilities for the graph visualization feature.
 *
 * Key responsibilities:
 * - Generating image sources for graph nodes based on object layouts
 * - Handling different icon types (emoji, image, type icons)
 * - Providing fallback icons for objects without custom icons
 *
 * The graph view displays objects as nodes with connections,
 * and this utility helps determine how each node should be visually represented.
 */
class UtilGraph {

	/**
	 * Returns the image source for an emoji, respecting the current emoji render mode.
	 * For Twemoji mode, returns a CDN SVG URL; otherwise returns a local PNG path.
	 * @param {string} iconEmoji - The native emoji character.
	 * @returns {string} The image source path or URL.
	 */
	emojiSrc (iconEmoji: string): string {
		const code = U.Smile.getCode(iconEmoji);
		if (!code) {
			return '';
		};

		if (S.Common.emojiRenderMode === I.EmojiRenderMode.Twemoji) {
			const native = U.Smile.nativeFromColons(code);
			if (native) {
				const url = U.Smile.toTwemojiUrl(native);
				if (url) {
					return url;
				};
			};
		};

		const src = U.Smile.srcFromColons(code);
		return src.replace(/^.\//, '');
	};

	/**
	 * Returns the image source path for a graph node based on its layout and properties.
	 * @param {any} d - The node data object.
	 * @returns {string} The image source path.
	 */
	imageSrc (d: any) {
		d = d || {};

		let src = '';

		switch (d.layout) {
			case I.ObjectLayout.Relation: {
				src = Relation.icon(d.relationKey, d.relationFormat, '#9B9B9B');
				break;
			};

			case I.ObjectLayout.Task: {
				src = `img/icon/graph/task${Number(d.done) || 0}.svg`;
				break;
			};

			case I.ObjectLayout.Date: {
				src = Relation.icon('', I.RelationType.Date, '#9B9B9B');
				break;
			};

			case I.ObjectLayout.Audio:
			case I.ObjectLayout.Video:
			case I.ObjectLayout.Pdf:
			case I.ObjectLayout.File: {
				src = U.File.iconPath(d);
				break;
			};

			case I.ObjectLayout.Image: {
				if (d.id) {
					src = S.Common.imageUrl(d.id, I.ImageSize.Small);
				} else {
					src = U.File.iconPath(d);
				};
				break;
			};
				
			case I.ObjectLayout.Human:
			case I.ObjectLayout.Participant: {
				if (d.iconImage) {
					src = S.Common.imageUrl(d.iconImage, I.ImageSize.Small);
				};
				break;
			};

			case I.ObjectLayout.Note: {
				break;
			};

			case I.ObjectLayout.Type: {
				if (d.iconImage) {
					src = S.Common.imageUrl(d.iconImage, I.ImageSize.Small);
				} else
				if (d.iconName) {
					src = U.Object.typeIcon(d.iconName, d.iconOption, 100);
				} else
				if (d.iconEmoji) {
					src = this.emojiSrc(d.iconEmoji);
				};
				break;
			};

			case I.ObjectLayout.Bookmark: {
				if (d.iconImage) {
					src = S.Common.imageUrl(d.iconImage, I.ImageSize.Small);
				};
				break;
			};
				
			default: {
				if (d.iconImage) {
					src = S.Common.imageUrl(d.iconImage, I.ImageSize.Small);
				} else
				if (d.iconEmoji) {
					src = this.emojiSrc(d.iconEmoji);
				} else {
					src = U.Object.defaultIcon(d.layout, d.type, 100);
				};
				break;
			};
		};

		return src;
	};

};

export default new UtilGraph();