// import ReactTimeAgo from 'react-time-ago'
// import CommentIcon from 'webapp-frontend/assets/images/icons/message-rect-dots.svg'
// import CommentIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square.svg'
// import DownRightArrow from 'webapp-frontend/assets/images/icons/down-right-arrow.svg'
// import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'
// const threadStats = (
// 	<div className="ThreadPage-stats">
// 		{/* Using a `<div/>` wrapper here because `title`
// 		    doesn't seem to work on `<svg/>`s. */}
// 		{fromIndex === 0 && shownComments.length > 0 &&
// 			<React.Fragment>
// 				<div
// 					title={fromIndex === 0 ? getMessages(locale).post.commentsCount : getMessages(locale).newComments}
// 					className="ThreadPage-stats-icon-container">
// 					<CommentIcon className="ThreadPage-stats-icon ThreadPage-stats-comment-icon"/>
// 				</div>
// 				<span
// 					title={fromIndex === 0 ? getMessages(locale).post.commentsCount : getMessages(locale).newComments}>
// 					{shownComments.length}
// 				</span>
// 				{
// 				<span className="ThreadPage-latest-comment-date-separator">
// 					/
// 				</span>
// 				<ReactTimeAgo
// 					date={thread.comments[thread.comments.length - 1].createdAt}
// 					locale={locale}
// 					tooltip={false}
// 					title={getMessages(locale).lastComment}
// 					className="ThreadPage-latest-comment-date"/>
// 				}
// 			</React.Fragment>
// 		}
// 		{/*
// 		{!thread.isBumpLimitReached && thread.willExpireSoon &&
// 			<div
// 				title={getMessages(locale).threadExpiresSoon.replace('{0}', 1).replace('{1}', 2)}
// 				className="ThreadPage-stats-icon-container">
// 				<DownRightArrow className="ThreadPage-stats-icon ThreadPage-stats-down-right-arrow-icon"/>
// 			</div>
// 		}
// 		{thread.isBumpLimitReached &&
// 			<div
// 				title={getMessages(locale).post.bumpLimitReached}
// 				className="ThreadPage-stats-icon-container">
// 				<SinkingBoatIcon className="ThreadPage-stats-icon ThreadPage-stats-sinking-icon"/>
// 			</div>
// 		}
// 		*/}
// 	</div>
// )