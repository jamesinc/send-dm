import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';

export default function canStartPrivateDiscussion(recipient) {
	return (
		app.session.user &&
		app.session.user.id() !== recipient.id() &&
		app.forum.attribute('canStartPrivateDiscussion') &&
		(!recipient.blocksPd() || app.forum.attribute('canStartPrivateDiscussionWithBlockers'))
	);
};

app.initializers.add('jamesinc/send-dm', () => {
	extend(CommentPost.prototype, 'actionItems', function (items) {
		const post = this.attrs.post;
		const user = post.user()

		if (!canStartPrivateDiscussion(user) || post.data.attributes.isHidden) return;

		items.add(
			"private-discussion",
			Button.component({
				className: "Button Button--link Button--sendPrivateMessage",
				onclick: (e) => {
					e.preventDefault();

					return new Promise((resolve) => {
						let recipients = new ItemList();
						let privateDiscussionComposer = require("@fof-byobu").discussions.PrivateDiscussionComposer;

						recipients.add("users:" + app.session.user.id(), app.session.user);
						recipients.add("users:" + user.id(), user)

						privateDiscussionComposer.prototype.recipients = recipients;

						app.composer.load(privateDiscussionComposer, {
							user: app.session.user,
							recipients: recipients,
							recipientUsers: recipients,
							titlePlaceholder: app.translator.trans("fof-byobu.forum.composer_private_discussion_title_placeholder"),
							submitLabel: app.translator.trans("fof-byobu.forum.composer_private_discussion.submit_button")
						});

						app.composer.show();
						return resolve(app.composer);
					});
				}
			},
				app.translator.trans("fof-byobu.forum.buttons.send_pd", { username: user.displayName() }))
		);
	});
});
