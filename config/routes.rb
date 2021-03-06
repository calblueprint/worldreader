Rails.application.routes.draw do
  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
    get "/login" => "devise/sessions#new"
  end

  devise_for :users, controllers: {
    registrations: "registrations",
    passwords: "passwords"
  }

  resources :users do
    get "booklists"
  end

  resources :books

  get "/booklists" => "book_lists#index"
  resources :book_lists, only: [:show]

  namespace :admin do
    resources :dashboard do
      collection do
        get "partners", as: "partners"
        post '/csv', to: 'dashboard#generate_csv'
        get "/failed_report", to: "dashboard#generate_failed_report"
      end
      member do
        get "partner_information", as: "partner_information"
        get "display_groups", as: "display_groups"
        get "display_books", as: "display_books"
        get "display_book", as: "display_book"
        post "/toggle_flag", to: "dashboard#toggle_flag"
      end
    end
    resources :recommendations do
      collection do
        get "display_recommendations", as: "display_recommendations"
        post "/add", to: "recommendations#add_recommendation"
        post "/delete", to: "recommendations#delete_recommendation"
      end
      member do
        post "/edit", to: "recommendations#edit_recommendation"
        get "display_books"
        get "display_book_tags"
        get "display_proj_tags"
      end
    end
  end

  # API routes for react updates
  namespace :api do
    namespace :v1 do
      resources :books do
        collection do
          get "" => "books#index"
          get "search" => "books#search"
          get "page" => "books#page"
          post "csv"
        end
      end
      resources :book_lists do
        member do
          get "books" => "book_lists#books"
          get "csv"
          delete "remove/:book_id" => "book_lists#remove"
          post "toggle_flag" => "book_lists#toggle_flag"
        end
        collection do
          post "add/:book_id" => "book_lists#add"
        end
      end
      resources :projects do
        collection do
          get "search/" => "projects#search"
        end
      end
    end
  end

  root to: "books#index"
end
