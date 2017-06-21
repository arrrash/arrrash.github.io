'use strict';

(function() {

    var app = angular.module('ocContent');

    app.controller('extensionFormCtrl', [
        '$scope',
        'AVAILABLE_MODULES',
        'localStorageFactory',
        'localStorageService',
        '$location',
        '$q',
        'userProfile',
        '$window',
        'extensionFormSrv',
        '$rootScope',
        '$timeout',
        function(
            $scope,
            AVAILABLE_MODULES,
            localStorageFactory,
            localStorageService,
            $location,
            $q,
            userProfile,
            $window,
            extensionFormSrv,
            $rootScope,
            $timeout
        ) {



            $scope.step = 0;
            $scope.formData = [];
            $scope.formData.extensionOtherReason = '';
            $scope.formData.selectedReason = [];
            $scope.formData.selectedCourse = {};
            $scope.formData.selectedCourse.courseName = 'Select course to extend';
            $scope.formData.extensionPrice = 0;
            $scope.formData.studentDetails = [];
            $scope.formData.selectedCourse.id = '';
            $scope.reasonLength = 0;
            $scope.showHealthPopup = false;
            $scope.showBubble = false;
            $scope.stepDescription = '';
            $scope.courseListVisible = false;
            $scope.showDurationPicker = false;
            $scope.eligible_months = [];
            $scope.errorType = '';
            $scope.showErrorPopup = false;
            $scope.pendingForPayment = false;
            $scope.applicationIdToCancel = '';
            $scope.isDataReady = false;
            $scope.supportUrl = '/f_home#/support/support-team';



            var durationSpan;
            var durationUnit;
            var viewPort = angular.element($window);
            $scope.formData.durationSelected = 0;

            $scope.DOMElementWatcher = function() {
                $scope.getWindowDimensions = function() {
                    return {
                        'h': viewPort.height(),
                        'w': viewPort.width()
                    };
                };

                $scope.$watch($scope.getWindowDimensions, function(newValue, oldValue) {
                    $scope.windowHeight = newValue.h;
                    // angular.element(document).find('.extention-form-step').height($scope.windowHeight);

                }, true);
            };

            $scope.renderDomElement = function() {
                // angular.element(document).find('.extention-form-step').height(viewPort.height());
            };


            $scope.nextStep = function(step, isEvent) {
                $scope.step = step;
                $scope.hideInfoBubble();
                $scope.renderDomElement();
                window.scrollTo(0, 0);
                if (isEvent) {
                    mixpanel.track('Step8:Return Home', {
                        'category ': 'support_forms',
                        'label': '',
                    });
                }
                if (step === 0) {
                    $scope.formData = [];
                    $scope.formData.extensionOtherReason = '';
                    $scope.formData.selectedReason = [];
                    $scope.formData.selectedCourse = {};
                    $scope.formData.extensionPrice = 0;
                    $scope.formData.selectedCourse.courseName = 'Select course to extend';
                    $scope.formData.studentDetails = [];
                    $scope.formData.selectedCourse.id = '';
                    $scope.formData.selectedCourse.extensionOptions = [];
                    $window.location.href = '#/form/extension';
                    $scope.isDataReady = false;
                    $scope.fetchData();

                }
                if (step !== 0) {
                    // var wrapper = angular.element(document).find('#extension-form');
                    // wrapper.removeClass('timeline');

                }
                $scope.percentageDone = { 'width': (step / 7) * 100 + '%' };
                switch (step) {
                    case 1:
                        mixpanel.track('Step1:get_started', {
                            'category ': 'support_forms',
                            'label': '',
                        });
                        //next step title
                        $scope.stepTitle = 'Terms & conditions';

                        break;
                    case 2:
                        mixpanel.track('Step2:terms_conditions', {
                            'category ': 'support_forms',
                            'label': '',
                        });

                        $scope.stepTitle = 'Why are you extending?';
                        break;
                    case 3:

                        mixpanel.track('Step3:Why are you extending', {
                            'category ': 'support_forms',
                            'label': 'type : [' + $scope.formData.selectedReason.keyword + ']',
                        });

                        $scope.stepTitle = 'Confirm your details';
                        break;
                    case 4:
                        mixpanel.track('Step4:Confirm your details', {
                            'category ': 'support_forms',
                            'label': 'course extension:[' + $scope.formData.selectedCourse.courseName + ']',
                        });

                        $scope.stepTitle = 'Extension duration';
                        break;
                    case 5:

                        mixpanel.track('Step5:Extension duration', {
                            'category ': 'support_forms',
                            'label': 'duration:[' + $scope.formData.durationSelected + ']',
                        });
                        $scope.stepTitle = 'Confirm Extension Details';
                        break;
                    case 7:
                        $scope.stepTitle = 'Extension successful';
                        mixpanel.track('Step8:Return Home', {
                            'category ': 'support_forms',
                            'label': '',
                        });

                        break;
                }
            };


            $scope.$watch(
                'formData.extensionOtherReason',
                function(newValue, oldValue) {
                    if (newValue !== oldValue && newValue) {

                        $scope.reasonLength = newValue.length;
                    }

                });

            $scope.changeStyle = function(state) {
                var wrapper = angular.element(document).find('#main-content');
                var footer = angular.element(document).find('#global-footer');
                if (state) {
                    wrapper.removeClass('content-section-bottom');
                    footer.addClass('display-none');
                } else {
                    wrapper.addClass('content-section-bottom');
                    footer.removeClass('display-none');
                }
            };


            $scope.pay = function() {
                // $scope.nextStep(7);
                $scope.pendingForPayment = true;
                var data = {};
                data.applicantId = $scope.formData.studentDetails.studentNumber;
                data.enrolmentId = $scope.formData.selectedCourse.enrolmentId;
                data.applicantEmail = $scope.formData.studentDetails.studentEmail;
                data.applicationRefCode = $scope.formData.selectedCourse.courseCode;
                data.applicationRefTitle = $scope.formData.selectedCourse.courseName;
                data.extensionOption = $scope.formData.extensionOption;
                data.extensionReason = $scope.formData.selectedReason.keyword;

                if (data.extensionReason.indexOf('other') > -1) {
                    data.extensionOtherReason = $scope.formData.extensionOtherReason;
                }


                // data.applicationId = $scope.formData
                extensionFormSrv.saveEnrolementDetails(data).then(function(response) {

                    if (response && response.paymentUrl) {
                        if (localStorageService.isSupported) {
                            var LSData = { 'date': $scope.formData.newExpiryDate, 'reason': $scope.formData.selectedReason.keyword };
                            localStorageService.set('extensionFormData', LSData);
                        }
                        mixpanel.track('Step7:Process payment', {
                            'category ': 'support_forms',
                            'label': '',
                        });
                        $window.location.href = response.paymentUrl;
                    } else {
                        $scope.pendingForPayment = false;
                        $scope.showErrorPopup = true;
                        $scope.errorTitle = 'Unknown error happened';
                        $scope.errorImage = 'app/src/extension-form/images/error.png';
                        $scope.errorMessage = '<p class="font-size-12px">It seems your selected course has issues for extension.</p>' +
                            '<p class="font-size-12px">Need some help? Support is always available. ';
                    }
                });


            };

            $scope.changeStyle(true);

            $scope.closePopup = function() {
                $scope.showHealthPopup = false;
                $scope.showDeletePopup = false;
                $scope.showErrorPopup = false;
            };

            $scope.showInfoBubble = function(step) {
                $scope.showBubble = true;

                switch (step) {
                    case 1:
                        $scope.stepDescription = '';
                        break;
                    case 2:
                        $scope.stepDescription = 'To ensure we point you in the right direction, tell us the option that best suits your situation';
                        break;
                    case 3:
                        $scope.stepDescription = 'Just confirming we have your correct enrolment details. Have more than one course? Just select the one you want to extend.';
                        break;
                    case 4:
                        $scope.stepDescription = 'Once you choose how long you want to extend for, you will see the total cost, your new expiry date and your future available extensions remaining.';
                        break;
                    case 5:
                        $scope.stepDescription = 'If your personal details are correct – select process payment.';
                        break;
                    case 7:
                        $scope.stepDescription = 'You have completed your application! Check your inbox for the confirmation email & don’t forget to access your personalised support from this page.';
                        break;

                }
            };

            $scope.hideInfoBubble = function() {
                $scope.showBubble = false;
            };

            $scope.showCourseList = function() {
                $scope.courseListVisible = true;
            };



            $scope.selectCourse = function(course, $event) {
                $scope.courseListVisible = false;
                if ($event) {
                    $event.stopImmediatePropagation();
                }
                if (!course.valid) {
                    $scope.handleErrors(course.validationErrors);
                }
                if (course.valid || course.validationErrors[0].code === 'EX1111') {
                    $scope.formData.selectedCourse = course;

                    var l = $scope.formData.selectedCourse.extensionOptions.length;
                    for (var i = 0; i < l; i++) {
                        durationSpan = parseInt($scope.formData.selectedCourse.extensionOptions[i].keyword.split(' ')[0]);
                        durationUnit = $scope.formData.selectedCourse.extensionOptions[i].keyword.split(' ')[1];
                        $scope.formData.selectedCourse.extensionOptions[i].span = durationSpan;
                        $scope.formData.selectedCourse.extensionOptions[i].unit = durationUnit;
                    }
                    $scope.formData.selectedCourse.maximunExtensionDuration = $scope.formData.selectedCourse.extensionOptions[l - 1];

                } else {
                    $scope.formData.selectedCourse = [];
                    $scope.formData.selectedCourse.courseName = 'Invalid course selected';
                }
            };

            $scope.handleErrors = function(error) {
                if (error) {
                    $scope.showErrorPopup = true;
                    switch (error[0].code) {
                        case 'EX0000':
                            $scope.errorType = 'maximum_reached';
                            $scope.errorTitle = 'Extension Limit Reached';
                            $scope.errorMessage = '<p class="font-size-12px">It looks like you’ve reached the maximum 6 months’ extension allowed. Unfortunately, we can’t extend you further. </p>' +
                                '<p class="font-size-12px">Need some help? Support is always available. ';
                            $scope.supportLink = 'page#/ask-for-support?faqid=17';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';
                            break;
                        case 'EX0001':
                            $scope.errorType = 'teachout';
                            $scope.errorTitle = 'Your course is in Teach-Out';
                            $scope.errorMessage = '<p class="font-size-12px">What does this mean?</p>' +
                                '<p class="font-size-12px">The Training Package for your course has expired and unfortunately this means we may not be able to grant any further extensions on your course.' +
                                'If you would like to discuss this further with a Student Support Officer, please get in touch with us below. </p>';
                            $scope.supportLink = 'page#/ask-for-support?faqid=17';
                            $scope.errorImage = 'app/src/extension-form/images/teach_out.png';
                            break;
                        case 'EX0002':
                            $scope.errorType = 'domestic_students';
                            $scope.errorTitle = 'Enrolled on a VET-FEE HELP / International Course';
                            $scope.errorMessage = '<p class="font-size-12px">As an International Student / Vet-Fee Help student, you will need to contact the Support Team to complete your extension application.</p>';
                            $scope.supportLink = 'page#/ask-for-support?faqid=17';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';

                            break;
                        case 'EX0003':
                            $scope.errorType = 'enrolment_expired';
                            $scope.errorTitle = 'Uh oh! It looks like your enrolment has expired.';
                            $scope.errorMessage = '<p class="font-size-12px">Unfortunately, we can’t apply this extension for you. Want to discuss your options? Our Student Support Team are here to help </p>';
                            $scope.supportLink = 'page#/ask-for-support?faqid=17';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';

                            break;
                        case 'EX0004':
                            $scope.errorType = 'student_in_debt';
                            $scope.errorTitle = 'Have you paid your course fees?';
                            $scope.errorMessage = '<p class="font-size-12px">To apply your extension, you will need to make sure all course fees due at the time of your application have been paid.</p> <p class="font-size-12px">Please contact our Payment Services Team (toll-free) on 1300 881 919 to organise payment of the fees. </p>';
                            $scope.supportLink = 'page#/profile/student-payment';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';

                            break;
                        case 'EX0005':
                            $scope.errorType = 'package_qualification';
                            $scope.errorTitle = 'Enrolled in Pathway / Dual Qualification';
                            $scope.errorMessage = '<p class="font-size-12px">It looks like you are enrolled in a Pathway or Dual qualification course, which means you will need to apply for your extension with our Student Support Team. </p> <p class="font-size-12px">You can download the form here and send it to us once complete. </p>';
                            $scope.supportLink = 'page#/faqs/my-profile-and-enrolment?jumpto=how-do-i-apply-for-a-course-extension';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';

                            break;


                        case 'EX1111':
                            $scope.errorType = 'pending_application';
                            $scope.errorTitle = 'Pending Application';
                            $scope.applicationIdToCancel = error[0].applicationNo;
                            $scope.errorMessage = '<p class="font-size-12px">It seems you have a pending application. That application will take 24 hours to cancel.</p>';
                            $scope.supportLink = 'page#/faqs/my-profile-and-enrolment?jumpto=how-do-i-apply-for-a-course-extension';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';

                            break;
                        default:
                            $scope.errorType = 'unknown';
                            $scope.errorTitle = 'Oops';
                            $scope.errorMessage = '<p class="font-size-12px">Uknown error happened, Please contact support';
                            $scope.supportLink = '/page#/ask-for-support';
                            $scope.errorImage = 'app/src/extension-form/images/not_elegible.png';

                            break;
                    }
                } else {

                }
            };

            $scope.selectReason = function(keyword, reason) {
                $scope.formData.selectedReason.keyword = keyword;
                $scope.formData.selectedReason.reason = reason;
                if ($scope.formData.selectedReason.keyword.indexOf('health') > -1) {
                    $scope.showHealthPopup = true;
                }
                if ($scope.formData.selectedReason.keyword === 'other_reason') {
                    $timeout(function() {
                        document.querySelector('#reasonTextBox').focus();
                    });
                }


            };

            $scope.clearReason = function() {
                $scope.showDeletePopup = true;
            };

            $scope.toggleDurationPicker = function() {
                $scope.showDurationPicker = !$scope.showDurationPicker;
            };

            $scope.selectDuration = function(num, unit, keyword, price) {

                $scope.formData.durationSelected = parseInt(num);
                $scope.formData.extensionOption = keyword;

                var currentExpiryDate = moment($scope.formData.selectedCourse.expiryDateTimestamp);
                $scope.formData.newExpiryDate = moment($scope.formData.selectedCourse.expiryDateTimestamp * 1000).add($scope.formData.durationSelected, 'M');
                $scope.formData.extensionPrice = (price / 100).toFixed(2);
                $scope.formData.extensionPricePerMonth = ($scope.formData.extensionPrice / $scope.formData.durationSelected).toFixed(2);

            };

            $scope.cancelApplication = function() {
                $scope.showErrorPopup = false;

                $scope.showCancelPopup = true;
                $scope.showErrorPopup = true;
                $scope.errorType = 'confirm_cancel';
                $scope.errorTitle = 'Are you sure?';
                $scope.errorMessage = 'Click yes if you want to Cancel the pervious application';
                $scope.errorImage = 'app/src/extension-form/images/error.png';

            };
            $scope.confirmApplicationCancel = function() {
                extensionFormSrv.cancelApplication($scope.applicationIdToCancel).then(
                    function(response) {
                        $scope.closePopup();
                        $scope.formData.selectedCourse.valid = true;

                    });
            };

            $scope.filterCourse = function(code) {
                var l = $scope.formData.studentDetails.enrolmentDetails.length;
                for (var i = 0; i < l; i++) {
                    if ($scope.formData.studentDetails.enrolmentDetails[i].courseCode === code) {
                        $scope.selectCourse($scope.formData.studentDetails.enrolmentDetails[i]);
                        break;
                    } else {
                        console.log('ERROR');
                    }
                }
            };


            if ($location.search().step) {

                switch ($location.search().authResult) {
                    case 'AUTHORISED':
                        $scope.paymentSuccessful = true;
                        $scope.resultImage = 'complete';
                        $scope.resultText = ' Congratulations!';
                        $scope.resultDesc = 'You have successfully submitted your application and a confirmation email has sent to:';
                        break;
                    default:
                        $scope.paymentSuccessful = false;
                        $scope.resultImage = 'error';
                        $scope.resultText = ' Payment Error!';
                        $scope.resultDesc = '<p>Unfortunately, your payment was not completed successfully.</p>' +
                            '<p>This may be due to a failed payment authorization, or the payment process was not completed in full. Don’t worry, no payment will be taken from your account. You can start a new application at any time.</p>';
                        break;

                }

                $scope.step = $location.search().step;

                if (localStorageService.get('extensionFormData')) {

                    $scope.expiryDate = localStorageService.get('extensionFormData').date;

                    if (localStorageService.get('extensionFormData').reason) {
                        var extensionReason = localStorageService.get('extensionFormData').reason;
                        switch (extensionReason) {
                            case ('time_management'):
                                $scope.supportUrl = '/f_home#/support/support-team';
                                break;
                            case ('harder_than_expected'):
                                $scope.supportUrl = '/f_home#/support/support-team';
                                break;
                            case ('work_placement'):
                                $scope.supportUrl = '/f_home#/support/structured-workplace-learning';
                                break;
                            case ('health_reasons'):
                                $scope.supportUrl = '/f_home?q=f_home#/support-article/how-to-get-back-on-track-break-in-studies';
                                break;
                            case ('other_reason'):
                                $scope.supportUrl = '/f_home#/support/study-tips-and-resources';
                                break;
                            case ('commitments'):
                                $scope.supportUrl = '/f_home#/support-article/studying-and-working-full-time';
                                break;
                            default:
                                $scope.supportUrl = '/f_home#/support/support-team';
                                break;
                        }
                    } else {

                    }
                }


            }
            $scope.contactSupport = function() {
                $window.location.href = $scope.supportUrl;

            };

            function success(data) {
                $scope.DOMElementWatcher();
                if (data[1]) {
                    $scope.isDataReady = true;
                }
                $scope.formData.studentDetails = data[1];
                $scope.formData.studentDetails.studentName = data[0][1].name;
                $scope.formData.studentDetails.studentImage = data[0][1].src_picture;
                $scope.formData.studentDetails.studentEmail = data[0][1].mail;
                $scope.formData.studentDetails.studentNumber = data[0][1].ve;
                $scope.extensionReasons = data[2];

            }

            $scope.fetchData = function() {
                extensionFormSrv.getToken().then(
                    function(response) {

                        var allPromises = $q.all([
                            localStorageFactory.get('userProfile'),
                            extensionFormSrv.getEnrolementDetails(localStorageFactory.get('userProfile')[1].ve),
                            extensionFormSrv.getReasons()
                        ]);
                        allPromises.then(success);
                    }
                );
            };
            //fetching data for the first time
            $scope.fetchData();


        }

    ]);

})();