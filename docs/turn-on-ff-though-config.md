# Turning on a feature using the theme config

The theme config is located in the repo at: /theme/[theme-name]/config.ts

There is a section in the theme called features which is a key-value pair
of the name of a feature and a boolean. For all apps currently the
feature knowledgeGraph: false is set. This means the apps will use the
feature flag setting.

To turn the feature on for everyone, without needing a feature flag,
simply change this to: knowledgeGraph: true and make a PR into the repo
and deploy it to the respective theme. The change will only affect the app
of the theme you have changed, so be careful to double check which theme
config one is editing.

⚠️ This will then overrule any feature flags for this feature
