import React, { useEffect, useState } from "react";
import saveWrapper from "Helpers/saveWrapper";
import ForumRoutingTable from "./ForumRoutingTable";
import requester from "Helpers/requester";
import { Result, Spin } from "antd";
import notificationHandler from "Helpers/notificationHandler";

const categoriesBuilder = (categories, threads) => {
  return categories.map((category) => {
    category.threads = threads.filter(
      (thread) => thread.categoryId === category.id
    );
    return category;
  });
};

const ForumAdminPage = ({
  setSaveHandler,
  setInitialValues,
  setHasChanges,
  initialValues,
  setResetHandler,
}) => {
  const [categories, setCategories] = useState(null); // latest categories (unsaved)

  useEffect(() => {
    if (categories === null) {
      Promise.all([
        requester.get("forum/categories"),
        requester.get("forum/threads"),
      ])
        .then(([categories, threads]) => {
          categories = categoriesBuilder(categories, threads);
          setInitialValues(categories);
          setCategories(categories);
        })
        .catch((err) => {
          console.error(err);
          notificationHandler.error(err);
        });
    } else {
      setSaveHandler((resolve, reject) => {
        const newThreads = [];
        const newCategories = [];
        Array.from(categories).forEach((category, index) => {
          category.threads = category.threads.map((thread, index) => {
            thread.categoryId = category.id;
            thread.order = index;

            newThreads.push(thread);

            return thread;
          });
          delete category.threads;
          category.order = index;
          newCategories.push(category);
        });

        Promise.all([
          requester.post("forum/categories-collection", newCategories),
          requester.post("forum/threads-collection", newThreads),
        ])
          .then(([categories, threads]) => {
            categories = categoriesBuilder(categories, threads);
            setCategories(categories);
            resolve(categories);
          })
          .catch((err) => reject(err));
      });

      setResetHandler((initialValues) => {
        setCategories(initialValues);
      });
    }
  }, [setInitialValues, categories]);

  const handleOnChange = (categories) => {
    setCategories(categories);
    setHasChanges();
  };

  const handleCreateCategory = (category) => {
    requester
      .post("forum/categories", category)
      .then((category) => {
        const newItems = [...categories];
        newItems.push({
          id: category.id,
          title: category.title,
          order: categories.length + 1,
          threads: [],
        });
        setCategories(newItems);
      })
      .catch((err) => {
        console.error(err);
        notificationHandler.error("Could not create category", err.message);
      });
  };

  if (!initialValues || !categories) {
    return <Result icon={<Spin></Spin>} />;
  }

  return (
    <ForumRoutingTable
      onCreateCategory={handleCreateCategory}
      onChange={handleOnChange}
      categories={categories}
    />
  );
};

export default saveWrapper(ForumAdminPage, "ForumAdminPage");
