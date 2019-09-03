<?php

namespace BNC\CoreBundle\Service;

use Symfony\Component\HttpFoundation\Request;
use Sitetheory\CoreBundle\Controller\InitController;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * Class CandidateHelper.
 */
class CandidateHelper
{
    public function getCandidateTracking(Request $request, InitController $controller, $options = [])
    {
        $candidateCookieName = 'candidate';
        $candidateData = [
            'url' => null,
            'name' => null,
            'slug' => null,
        ];
        $candidateDataLast = $candidateData;

        /*
         * Universal Candidate Cookie
         *
         * This needs to works with the StreamBundle\Controller\LandingCandidateController which sets the preferred candidate when
         * someone arrives to that landing page on the site.
         *
         * Check if there is a cookie indicating the user's preferred candidate
         * Add the values to the template for easy access
         */

        // If a candidate referrer is set, check that it's valid and save it
        if (!empty($request->query->get($candidateCookieName))) {
            $slug = $this->makeCandidateSlug($request->query->get($candidateCookieName));

            // Candidate can be a full name or a slug, we'll clean it.
            $candidateData = [
                // We set the URL on the Candidate's page, but if on another page they ask for a specific candidate
                // We'll use that slug for the return URL
                'url' => '/'.$slug,
                'slug' => $slug,
                'name' => $this->expandCandidateSlug($request->query->get($candidateCookieName)),
            ];
            // Also mark the candidate as the Last Candidate
            $candidateDataLast = $candidateData;
            // Set a cookie for the "last" candidate page visited.

            $controller->getEnv()->addCookie(
                new Cookie($candidateCookieName, json_encode($candidateData), time() + 36000, '/', null, false, false)
            );
        } else {
            if ($request->cookies->has($candidateCookieName)) {
                $candidateData = json_decode($request->cookies->get($candidateCookieName), true);
            }
        }
        if ($request->cookies->has($candidateCookieName.'Last')) {
            $candidateDataLast = json_decode($request->cookies->get($candidateCookieName.'Last'), true);
        }

        // No matter what, we always set a value
        $controller->getContent()->data[$candidateCookieName] = $candidateData;
        $controller->getContent()->data[$candidateCookieName.'Last'] = $candidateDataLast;
    }

    /**
     * Add custom functionality to the standard LandingController.
     *
     * @param Request        $request
     * @param InitController $controller
     */
    public function setCandidateTracking(Request $request, InitController $controller)
    {
        $candidateData = [
            'url' => '/'.trim($request->getRequestUri(), '/'),
            'name' => $controller->getContent()->getVersion()->getTitle(),
            'slug' => $this->makeCandidateSlug($controller->getContent()->getVersion()->getTitle()),
        ];

        // Set a cookie for the "last" candidate page visited.
        $controller->getEnv()->addCookie(
            new Cookie('candidateLast', json_encode($candidateData), time() + 36000, '/', null, false, false)
        );

        // Only set the cookie for "candidate" if this came from an external referrer (not internal browsing)
        if (empty($controller->getEnv()->getReferrer())
            || !$controller->getEnvHelper()->isInternalReferrer($request, $controller->getEnv()->getReferrer())
        ) {
            // Set a cookie to specify that this candidate is the primary candidate they are interested
            $controller->getEnv()->addCookie(new Cookie('candidate', json_encode($candidateData), time() + 36000, '/', null, false, false));
        }
    }

    public function makeCandidateSlug($name)
    {
        $slug = ucwords(strtolower($name));
        $slug = str_replace(' ', '-', $slug);
        $slug = preg_replace('~[^a-z-]+~i', '', $slug);

        return $slug;
    }

    public function expandCandidateSlug($slug)
    {
        $name = str_replace('-', ' ', $slug);
        $name = ucwords($name);
        // add initials with period
        $name = preg_replace('~([A-Z]{1}) }~', '$1. ', $name);

        return $name;
    }
}
