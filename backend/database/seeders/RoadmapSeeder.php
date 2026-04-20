<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RoadmapSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) {
            if (isset($this->command)) {
                $this->command->error('No users found. Run UserSeeder first.');
            }
            return;
        }
        
        foreach ($users as $user) {
            $this->seedForUser((string) $user->_id);
        }

        if (isset($this->command)) {
            $this->command->info('Roadmap seeded: 12 weeks of ML/DL tasks created for ' . $users->count() . ' users.');
        }
    }

    public function seedForUser(string $userId): void
    {
        $baseDate = Carbon::now()->startOfWeek();
        $roadmap = $this->getRoadmapData();

        foreach ($roadmap as $weekData) {
            $weekNum = $weekData['week'];
            $weekStart = $baseDate->copy()->addWeeks($weekNum - 1);
            $weekEnd = $weekStart->copy()->addDays(6);

            foreach ($weekData['tasks'] as $taskData) {
                Task::updateOrCreate(
                    [
                        'user_id' => $userId,
                        'week_number' => $weekNum,
                        'title' => $taskData['title'],
                    ],
                        [
                            'user_id' => $userId,
                            'week_number' => $weekNum,
                            'category' => $weekData['category'],
                            'title' => $taskData['title'],
                            'description' => $taskData['description'],
                            'priority' => $taskData['priority'],
                            'estimated_hours' => $taskData['estimated_hours'],
                            'checkbox_completed' => false,
                            'status' => 'not_started',
                            'start_date' => $weekStart,
                            'due_date' => $weekEnd,
                            'completed_at' => null,
                            'submission_required' => $taskData['submission_required'],
                            'answer_summary' => null,
                            'notes' => null,
                            'blockers' => null,
                        ]
                    );
                }
            }
        }

    private function getRoadmapData(): array
    {
        return [
            // Week 1: Python Fundamentals
            [
                'week' => 1,
                'category' => 'Python Fundamentals',
                'tasks' => [
                    [
                        'title' => 'Setup Python Environment',
                        'description' => 'Install Python 3.10+, setup virtual environment, install Jupyter Notebook. Familiarize with VS Code / PyCharm IDE setup for ML development.',
                        'priority' => 'high',
                        'estimated_hours' => 2,
                        'submission_required' => false,
                    ],
                    [
                        'title' => 'NumPy Array Operations',
                        'description' => 'Master NumPy basics: array creation, indexing, slicing, broadcasting, vectorized operations, and linear algebra operations with arrays.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Pandas DataFrame Mastery',
                        'description' => 'Learn Pandas fundamentals: Series, DataFrame creation, data selection, filtering, groupby, merge/join, pivot tables, and handling missing data.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Data Visualization with Matplotlib & Seaborn',
                        'description' => 'Create various plot types: line, bar, scatter, histogram, heatmap, boxplot. Learn customization, subplots, and styling for publication-quality figures.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Mini Project: Exploratory Data Analysis',
                        'description' => 'Perform a complete EDA on a real dataset (e.g., Titanic, Iris). Include data loading, cleaning, visualization, and insights summary.',
                        'priority' => 'high',
                        'estimated_hours' => 6,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 2: Math & Statistics
            [
                'week' => 2,
                'category' => 'Math & Statistics',
                'tasks' => [
                    [
                        'title' => 'Descriptive Statistics',
                        'description' => 'Study mean, median, mode, variance, standard deviation, percentiles, and distribution shapes. Implement calculations using NumPy and Pandas.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Probability Distributions',
                        'description' => 'Learn about normal, binomial, Poisson, and uniform distributions. Understand PDF, CDF, and how to generate random samples with SciPy.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Correlation & Covariance Analysis',
                        'description' => 'Understand Pearson, Spearman correlations. Create correlation matrices and heatmaps. Learn the difference between correlation and causation.',
                        'priority' => 'medium',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Linear Algebra: Vectors & Matrices',
                        'description' => 'Review vectors, matrix multiplication, transpose, inverse, eigenvalues/eigenvectors. Understand their role in ML algorithms.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => false,
                    ],
                    [
                        'title' => 'Statistical Hypothesis Testing',
                        'description' => 'Learn t-test, chi-square test, ANOVA, p-values, confidence intervals. Apply tests to real datasets and interpret results.',
                        'priority' => 'medium',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 3: ML Basics
            [
                'week' => 3,
                'category' => 'ML Concepts',
                'tasks' => [
                    [
                        'title' => 'What is Machine Learning? Concepts Overview',
                        'description' => 'Understand ML definition, types of learning (supervised, unsupervised, reinforcement), applications in industry, and the ML workflow/pipeline.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => false,
                    ],
                    [
                        'title' => 'Supervised vs Unsupervised Learning',
                        'description' => 'Deep dive into classification vs regression, clustering vs dimensionality reduction. Study real-world use cases for each paradigm.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Train/Test Split & Validation Strategies',
                        'description' => 'Learn train/test split, validation set purpose, k-fold cross-validation, stratified splitting. Implement with sklearn train_test_split.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Feature Engineering Basics',
                        'description' => 'Understand feature types, feature creation, feature selection techniques. Learn about domain knowledge in feature engineering.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Hands-on: First ML Pipeline',
                        'description' => 'Build your first end-to-end ML pipeline: load data → preprocess → train model → predict → evaluate. Use sklearn with a simple dataset.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 4: Classic ML Algorithms
            [
                'week' => 4,
                'category' => 'Classic Algorithms',
                'tasks' => [
                    [
                        'title' => 'Linear Regression Deep Dive',
                        'description' => 'Understand ordinary least squares, cost function, gradient descent. Implement from scratch and with sklearn. Interpret coefficients and R² score.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Logistic Regression for Classification',
                        'description' => 'Learn sigmoid function, log-loss, decision boundary. Implement binary and multi-class classification. Understand regularization (L1/L2).',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'k-Nearest Neighbors (kNN)',
                        'description' => 'Understand distance metrics (Euclidean, Manhattan), choosing k, curse of dimensionality. Implement kNN classifier and regressor.',
                        'priority' => 'medium',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Decision Tree Classifier & Regressor',
                        'description' => 'Learn information gain, Gini impurity, pruning strategies. Visualize decision trees. Understand overfitting in tree models.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Algorithm Comparison Mini Project',
                        'description' => 'Compare all 4 algorithms on the same dataset. Create comparison table with metrics. Write analysis of strengths and weaknesses.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 5: Evaluation Metrics
            [
                'week' => 5,
                'category' => 'Evaluation Metrics',
                'tasks' => [
                    [
                        'title' => 'Accuracy, Precision, Recall & F1-Score',
                        'description' => 'Master classification metrics. Understand when to use each metric. Learn about macro, micro, and weighted averaging for multi-class.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Confusion Matrix Analysis',
                        'description' => 'Build and interpret confusion matrices. Understand TP, FP, TN, FN. Visualize confusion matrices with seaborn heatmaps.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'ROC & AUC Curves',
                        'description' => 'Understand ROC curve construction, AUC interpretation, threshold tuning. Compare models using AUC. Learn precision-recall curves.',
                        'priority' => 'medium',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Cross-Validation Techniques',
                        'description' => 'Implement k-fold, stratified k-fold, leave-one-out, time-series CV. Understand bias-variance tradeoff in validation.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Evaluation Mini Project',
                        'description' => 'Apply all evaluation techniques to a classification problem. Create comprehensive evaluation report with visualizations and recommendations.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 6: Preprocessing
            [
                'week' => 6,
                'category' => 'Data Preprocessing',
                'tasks' => [
                    [
                        'title' => 'Missing Data Handling',
                        'description' => 'Learn imputation strategies: mean/median/mode, KNN imputation, iterative imputer. Understand when to drop vs impute. Handle MCAR, MAR, MNAR.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Categorical Encoding',
                        'description' => 'Master one-hot encoding, label encoding, ordinal encoding, target encoding. Learn when to use each method and pitfalls.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Feature Scaling & Normalization',
                        'description' => 'Understand StandardScaler, MinMaxScaler, RobustScaler, Normalizer. Learn which algorithms require scaling and why.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Outlier Detection & Handling',
                        'description' => 'Learn IQR method, Z-score, isolation forest, DBSCAN for outlier detection. Understand strategies: remove, cap, transform.',
                        'priority' => 'medium',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Full Preprocessing Pipeline',
                        'description' => 'Build a complete sklearn Pipeline with ColumnTransformer. Handle mixed data types. Create reusable preprocessing templates.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 7: Advanced ML
            [
                'week' => 7,
                'category' => 'Advanced ML',
                'tasks' => [
                    [
                        'title' => 'Random Forest Ensemble',
                        'description' => 'Understand bagging, feature importance, OOB score. Tune n_estimators, max_depth, min_samples_split. Compare with single decision tree.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Gradient Boosting & XGBoost',
                        'description' => 'Learn boosting concept, learning rate, XGBoost vs LightGBM. Implement gradient boosting for classification and regression tasks.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Support Vector Machine (SVM)',
                        'description' => 'Understand hyperplanes, margins, kernel trick (RBF, polynomial, linear). Implement SVM for classification. Tune C and gamma parameters.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'K-Means Clustering',
                        'description' => 'Learn k-means algorithm, elbow method, silhouette score. Implement clustering on real data. Visualize clusters with PCA/t-SNE.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Advanced Model Comparison Project',
                        'description' => 'Compare Random Forest, XGBoost, SVM on a complex dataset. Perform hyperparameter tuning with GridSearchCV. Write comparison report.',
                        'priority' => 'high',
                        'estimated_hours' => 6,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 8: ML End-to-End Project
            [
                'week' => 8,
                'category' => 'ML Project',
                'tasks' => [
                    [
                        'title' => 'End-to-End ML Project Planning',
                        'description' => 'Define problem statement, identify data sources, plan pipeline stages, set success metrics. Create project timeline and milestones.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Data Collection & EDA',
                        'description' => 'Collect or download dataset. Perform thorough EDA: distributions, correlations, missing values, class imbalance. Document findings.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Model Training & Hyperparameter Tuning',
                        'description' => 'Train multiple models, perform hyperparameter tuning with GridSearch/RandomSearch. Use cross-validation for robust evaluation.',
                        'priority' => 'high',
                        'estimated_hours' => 6,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Model Evaluation & Reporting',
                        'description' => 'Evaluate best model with all metrics. Create visualizations: confusion matrix, ROC, feature importance. Write final evaluation report.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Project Documentation & Presentation',
                        'description' => 'Write comprehensive README, create Jupyter notebook with narrative. Prepare brief presentation slides summarizing methodology and results.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 9: DL Basics
            [
                'week' => 9,
                'category' => 'Deep Learning Basics',
                'tasks' => [
                    [
                        'title' => 'Neural Network Architecture',
                        'description' => 'Understand perceptrons, layers, neurons, weights, biases. Learn feed-forward networks, input/hidden/output layers.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => false,
                    ],
                    [
                        'title' => 'Activation Functions',
                        'description' => 'Study ReLU, Sigmoid, Tanh, Softmax, Leaky ReLU. Understand vanishing gradient problem. Know when to use each activation.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Loss Functions & Optimization',
                        'description' => 'Learn MSE, cross-entropy, binary cross-entropy. Understand loss landscapes and how optimization navigates them.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Gradient Descent Deep Dive',
                        'description' => 'Study batch, mini-batch, stochastic gradient descent. Understand learning rate, convergence, and backpropagation algorithm.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'First Neural Network with PyTorch/TensorFlow',
                        'description' => 'Implement a simple fully-connected neural network for MNIST or similar dataset. Train, evaluate, and visualize training curves.',
                        'priority' => 'high',
                        'estimated_hours' => 6,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 10: DL Training
            [
                'week' => 10,
                'category' => 'DL Training',
                'tasks' => [
                    [
                        'title' => 'Optimizer Comparison',
                        'description' => 'Study SGD, Adam, RMSprop, AdaGrad. Compare convergence speed and final performance. Implement experiments with different optimizers.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Dropout & Regularization',
                        'description' => 'Understand dropout, L2 regularization, batch normalization. Learn about overfitting prevention in deep networks.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Early Stopping Implementation',
                        'description' => 'Implement early stopping with patience. Create callbacks for model checkpointing. Understand the role of validation loss monitoring.',
                        'priority' => 'medium',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Learning Curves & Loss Analysis',
                        'description' => 'Plot and interpret training/validation loss curves. Diagnose underfitting, overfitting, and good fit from curves.',
                        'priority' => 'high',
                        'estimated_hours' => 3,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'DL Training Best Practices Project',
                        'description' => 'Apply all training techniques to improve a neural network. Document the effect of each technique on performance.',
                        'priority' => 'high',
                        'estimated_hours' => 6,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 11: Specialization
            [
                'week' => 11,
                'category' => 'Specialization (CV/NLP)',
                'tasks' => [
                    [
                        'title' => 'Choose Your Path: CV or NLP',
                        'description' => 'Research Computer Vision (CNN, image classification) and NLP (text processing, transformers). Choose one path based on your interest and career goals.',
                        'priority' => 'high',
                        'estimated_hours' => 2,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Domain-Specific Data Preparation',
                        'description' => 'CV: image augmentation, resizing, normalization. NLP: tokenization, stopwords, stemming/lemmatization, word embeddings.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Build Domain-Specific Model',
                        'description' => 'CV: build CNN for image classification (CIFAR-10 or custom). NLP: build text classifier or sentiment analyzer.',
                        'priority' => 'high',
                        'estimated_hours' => 6,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Evaluate Specialized Model',
                        'description' => 'Apply domain-specific evaluation. CV: visualize filters, grad-CAM. NLP: confusion matrix, per-class analysis, attention visualization.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                ],
            ],

            // Week 12: Final Project
            [
                'week' => 12,
                'category' => 'Final Project',
                'tasks' => [
                    [
                        'title' => 'Final Project Planning & Proposal',
                        'description' => 'Write project proposal: problem statement, dataset choice, methodology plan, expected outcomes. Get approval before starting.',
                        'priority' => 'high',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Implementation & Model Training',
                        'description' => 'Implement complete pipeline: data loading, preprocessing, model architecture, training loop, with clean code and documentation.',
                        'priority' => 'high',
                        'estimated_hours' => 10,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Evaluation & Error Analysis',
                        'description' => 'Comprehensive model evaluation. Perform error analysis: identify failure cases, analyze patterns, suggest improvements.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Documentation & Final Presentation',
                        'description' => 'Create professional README, clean notebook, and presentation. Include methodology, results, lessons learned, and future work.',
                        'priority' => 'high',
                        'estimated_hours' => 5,
                        'submission_required' => true,
                    ],
                    [
                        'title' => 'Portfolio Preparation & Reflection',
                        'description' => 'Organize all 12 weeks of work into a portfolio. Write overall reflection on the learning journey. Plan next steps in ML/DL career.',
                        'priority' => 'medium',
                        'estimated_hours' => 4,
                        'submission_required' => true,
                    ],
                ],
            ],
        ];
    }
}
