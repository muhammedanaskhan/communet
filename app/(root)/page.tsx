import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts, getReactionsData } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await currentUser();

  if(!user) redirect('/sign-in');

  const result = await fetchPosts(1, 20);

  const userInfo = await fetchUser(user.id);
  if(!userInfo?.onboarded) redirect('/onboarding');

  const reactionsData = await getReactionsData({
    userId: userInfo._id,
    posts: result.posts,
  });

  const { childrenReactions, childrenReactionState } = reactionsData;

  return (
      <div>
        {/* <UserButton afterSignOutUrl="/" /> */}
        <h1 className="head-text text-left">Home</h1>
        <section className="flex flex-col mt-9 gap-10">
          {result.posts.length === 0 ? (
            <p className="no-result">No threads found</p>
          ) : (
              <>
                {result.posts.map((post, idx) => (
                  <ThreadCard 
                    key={post._id}
                    id={post._id}
                    currentUserId={user?.id || ''}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                    reactions={childrenReactions[idx].users}
                    reactState={childrenReactionState[idx]}
                  />
                ))}
              </>
          )}
        </section>
      </div>

  )
}

