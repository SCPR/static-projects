    var jqueryNoConflict = jQuery;
    var configData = configData || {};

    // pull data from spreadsheet onload
    jqueryNoConflict(document).ready(function(){
        var charts = [new Highcharts.Chart(
            createScatterPlot('data-visuals', 'scatter', dataArray)
        )];
    });

    var dataArray = [{
        color: '#a2a2a2',
        type: 'line',
        name: 'API Threshold',
        data: [[800, 0], [800, 100]],
        showInLegend: false,
        marker: {
            enabled: false
        },
        hover: {
            enabled: false
        }
    }, {
        color: '#a2a2a2',
        type: 'line',
        name: 'Trend',
        visible: false,
        data: [[685, 84], [910, 15]],
        showInLegend: false,
        marker: {
            enabled: false
        },
        states: {
            hover: {
                enabled: false
            }
        }
    }, {
        name: 'Los Angeles County',
        color: '#E41A1C',
        data: [
            {name: 'Los Angeles Unified', x: 728, y: 74.7193283986456},
            {name: 'Long Beach Unified', x: 748, y: 51.1418725541732},
            {name: 'Montebello Unified', x: 723, y: 94.276679137716},
            {name: 'Pomona Unified', x: 714, y: 83.1449126413155},
            {name: 'Glendale Unified', x: 803, y: 22.9712858926342},
            {name: 'Torrance Unified', x: 795, y: 26.425529561418},
            {name: 'William S. Hart Union High', x: 782, y: 34.3725555928036},
            {name: 'Compton Unified', x: 706, y: 79.5602371495999},
            {name: 'Downey Unified', x: 804, y: 86.9780155868326},
            {name: 'Antelope Valley Union High', x: 693, y: 52.7749029754204},
            {name: 'ABC Unified', x: 784, y: 42.9790282662498},
            {name: 'Hacienda la Puente Unified', x: 791, y: 80.4630679922599},
            {name: 'Palmdale Elementary', x: 745, y: 71.111710375514},
            {name: 'Norwalk-La Mirada Unified', x: 765, y: 78.9656128674431},
            {name: 'Castaic Union', x: 784, y: 36.5742844161744},
            {name: 'Alhambra Unified', x: 769, y: 43.2964237617836},
            {name: 'Pasadena Unified', x: 722, y: 61.1550387596899},
            {name: 'Burbank Unified', x: 799, y: 37.4826388888888},
            {name: 'Paramount Unified', x: 778, y: 87.4978219201951},
            {name: 'Walnut Valley Unified', x: 825, y: 22.2855108579565},
            {name: 'Rowland Unified', x: 754, y: 63.7055148057593},
            {name: 'Baldwin Park Unified', x: 759, y: 90.604642627764},
            {name: 'Lynwood Unified', x: 725, y: 94.0081875697804},
            {name: 'Lancaster Elementary', x: 729, y: 49.9252019547222},
            {name: 'Bellflower Unified', x: 782, y: 61.5447071957779},
            {name: 'Covina-Valley Unified', x: 784, y: 76.040126715945},
            {name: 'Whittier Union High', x: 783, y: 86.2557223464281},
            {name: 'Palos Verdes Peninsula Unified', x: 859, y: 8.43505993621467},
            {name: 'Inglewood Unified', x: 721, y: 61.6518834235687},
            {name: 'Las Virgenes Unified', x: 844, y: 9.10062967803255},
            {name: 'Santa Monica-Malibu Unified', x: 791, y: 29.6448417492147},
            {name: 'West Covina Unified', x: 813, y: 75.4751131221719},
            {name: 'Arcadia Unified', x: 834, y: 13.5480364179915},
            {name: 'Bonita Unified', x: 845, y: 46.5789112847936},
            {name: 'Saugus Union', x: 817, y: 27.572869180826},
            {name: 'Azusa Unified', x: 734, y: 92.3874947427449},
            {name: 'El Rancho Unified', x: 774, y: 97.6615646258503},
            {name: 'El Monte City', x: 763, y: 77.7358490566037},
            {name: 'East Whittier City Elementary', x: 842, y: 80.319535221496},
            {name: 'El Monte Union High', x: 704, y: 77.7271390767421},
            {name: 'Hawthorne', x: 797, y: 70.5251875669882},
            {name: 'Redondo Beach Unified', x: 829, y: 22.6362366092221},
            {name: 'Westside Union Elementary', x: 818, y: 37.8243978243978},
            {name: 'Glendora Unified', x: 832, y: 39.3532426223714},
            {name: 'Mountain View Elementary', x: 747, y: 93.1280923584387},
            {name: 'Claremont Unified', x: 820, y: 38.1490707031998},
            {name: 'Manhattan Beach Unified', x: 901, y: 12.0327102803738},
            {name: 'Culver City Unified', x: 820, y: 39.3267486393872},
            {name: 'Newhall', x: 851, y: 42.2642284775015},
            {name: 'Whittier City Elementary', x: 790, y: 92.3833975181857},
            {name: 'Temple City Unified', x: 800, y: 20.508166969147},
            {name: 'Centinela Valley Union High', x: 683, y: 74.0681818181818},
            {name: 'Monrovia Unified', x: 770, y: 59.7295438918175},
            {name: 'Lawndale Elementary', x: 796, y: 77.1461716937354},
            {name: 'Lennox', x: 780, y: 96.5844402277039},
            {name: 'Charter Oak Unified', x: 783, y: 59.9074975657254},
            {name: 'Garvey Elementary', x: 738, y: 41.3990540204132},
            {name: 'San Gabriel Unified', x: 753, y: 35.2424014066817},
            {name: 'Sulphur Springs Union', x: 798, y: 44.8921237327787},
            {name: 'South Pasadena Unified', x: 849, y: 23.468803663423},
            {name: 'Little Lake City Elementary', x: 844, y: 88.6279003150959},
            {name: 'Beverly Hills Unified', x: 872, y: 6.48371531966224},
            {name: 'La Canada Unified', x: 908, y: 9.89321608040201},
            {name: 'Bassett Unified', x: 754, y: 94.9235274975593},
            {name: 'Duarte Unified', x: 771, y: 75.5685986793837},
            {name: 'El Segundo Unified', x: 852, y: 23.1072555205047},
            {name: 'South Whittier Elementary', x: 752, y: 93.352249695987},
            {name: 'San Marino Unified', x: 880, y: 9.52768729641693},
            {name: 'Lowell Joint', x: 854, y: 61.7213114754098},
            {name: 'Eastside Union Elementary', x: 721, y: 61.7003005581794},
            {name: 'Rosemead Elementary', x: 790, y: 41.4567109482363},
            {name: 'Wiseburn Elementary', x: 852, y: 58.7179487179487},
            {name: 'Keppel Union Elementary', x: 746, y: 76.2933199397287},
            {name: 'Los Angeles County Office of Education', x: 634, y: 61.7405582922824},
            {name: 'Los Nietos', x: 786, y: 96.4131994261119},
            {name: 'Acton-Agua Dulce Unified', x: 716, y: 32.3076923076923},
            {name: 'Wilsona Elementary', x: 772, y: 64.6687697160883},
            {name: 'Valle Lindo Elementary', x: 830, y: 94.9058693244739}
        ]}, {
        name: 'Orange County',
        color: '#377EB8',
        data: [
            {name: 'Santa Ana Unified', x: 737, y: 95.5154877484974},
            {name: 'Capistrano Unified', x: 781, y: 24.7193060150571},
            {name: 'Garden Grove Unified', x: 753, y: 53.0616285318324},
            {name: 'Anaheim Union High', x: 734, y: 64.5140942243248},
            {name: 'Saddleback Valley Unified', x: 791, y: 29.9761673581075},
            {name: 'Irvine Unified', x: 836, y: 9.960252513444},
            {name: 'Orange Unified', x: 778, y: 50.2984860786092},
            {name: 'Placentia-Yorba Linda Unified', x: 807, y: 37.9879801411026},
            {name: 'Tustin Unified', x: 794, y: 45.5903749300503},
            {name: 'Newport-Mesa Unified', x: 760, y: 42.7151906595453},
            {name: 'Anaheim City', x: 753, y: 86.164500817057},
            {name: 'Huntington Beach Union High', x: 758, y: 24.6572995202193},
            {name: 'Fullerton Elementary', x: 793, y: 49.3542791056283},
            {name: 'Fullerton Joint Union High', x: 770, y: 52.8003089996137},
            {name: 'Los Alamitos Unified', x: 889, y: 22.3401360544217},
            {name: 'Ocean View', x: 789, y: 35.5268756204793},
            {name: 'Westminster', x: 752, y: 41.6905034324942},
            {name: 'Huntington Beach City Elementa', x: 846, y: 18.7872023809523},
            {name: 'Fountain Valley Elementary', x: 851, y: 14.8468976631748},
            {name: 'Brea-Olinda Unified', x: 817, y: 33.9285714285714},
            {name: 'Magnolia Elementary', x: 791, y: 69.0026309495336},
            {name: 'La Habra City Elementary', x: 760, y: 83.2731958762886},
            {name: 'Buena Park Elementary', x: 774, y: 63.8961719979024},
            {name: 'Centralia Elementary', x: 836, y: 53.763440860215},
            {name: 'Cypress Elementary', x: 814, y: 27.2490706319702},
            {name: 'Laguna Beach Unified', x: 857, y: 8.80312228967909},
            {name: 'Orange County Department of Education', x: 570, y: 51.3737461840383},
            {name: 'Savanna Elementary', x: 776, y: 57.2784810126582}
        ]}, {
        name: 'Riverside County',
        color: '#4DAF4A',
        data: [
            {name: 'Corona-Norco Unified', x: 781, y: 50.9231970578603},
            {name: 'Riverside Unified', x: 765, y: 58.4929550029218},
            {name: 'Moreno Valley Unified', x: 741, y: 67.0307167235494},
            {name: 'Desert Sands Unified', x: 780, y: 70.5005126293223},
            {name: 'Temecula Valley Unified', x: 831, y: 30.8873398643556},
            {name: 'Murrieta Valley Unified', x: 820, y: 33.0788507488781},
            {name: 'Palm Springs Unified', x: 735, y: 74.4777096601392},
            {name: 'Lake Elsinore Unified', x: 771, y: 54.2842581384978},
            {name: 'Hemet Unified', x: 730, y: 51.5385117919905},
            {name: 'Jurupa Unified', x: 748, y: 83.1377784023045},
            {name: 'Val Verde Unified', x: 800, y: 73.1054452998093},
            {name: 'Alvord Unified', x: 755, y: 78.084138715179},
            {name: 'Coachella Valley Unified', x: 690, y: 96.9371106496588},
            {name: 'Perris Union High', x: 730, y: 70.5413179916317},
            {name: 'Menifee Union Elementary', x: 824, y: 42.9138062547673},
            {name: 'Beaumont Unified', x: 778, y: 48.7005997232046},
            {name: 'San Jacinto Unified', x: 748, y: 68.9090057749336},
            {name: 'Perris Elementary', x: 742, y: 86.0154241645244},
            {name: 'Banning Unified', x: 731, y: 63.3021605933569},
            {name: 'Palo Verde Unified', x: 642, y: 64.160910199106},
            {name: 'Romoland Elementary', x: 765, y: 70.0787401574803},
            {name: 'Nuview Union', x: 781, y: 70.251572327044},
            {name: 'Riverside County County Office of Education', x: 485, y: 60.8219178082191}
        ]}, {
        name: 'San Bernardino County',
        color: '#984EA3',
        data: [
            {name: 'San Bernardino City Unified', x: 726, y: 74.0377987132352},
            {name: 'Fontana Unified', x: 753, y: 85.9026086956521},
            {name: 'Chino Valley Unified', x: 775, y: 56.6317507822065},
            {name: 'Rialto Unified', x: 753, y: 80.6417785234899},
            {name: 'Chaffey Joint Union High', x: 753, y: 62.5913659205116},
            {name: 'Colton Joint Unified', x: 723, y: 81.761417697431},
            {name: 'Ontario-Montclair', x: 763, y: 88.6311603807687},
            {name: 'Redlands Unified', x: 791, y: 44.7763132264138},
            {name: 'Hesperia Unified', x: 743, y: 61.3619786486307},
            {name: 'Etiwanda Elementary', x: 865, y: 43.0209953343701},
            {name: 'Apple Valley Unified', x: 753, y: 41.5106732348111},
            {name: 'Upland Unified', x: 803, y: 51.5373185506915},
            {name: 'Victor Elementary', x: 782, y: 57.4671916010498},
            {name: 'Victor Valley Union High', x: 720, y: 58.5376162299239},
            {name: 'Yucaipa-Calimesa Joint Unified', x: 747, y: 38.5575589459084},
            {name: 'Snowline Joint Unified', x: 771, y: 38.656462585034},
            {name: 'Morongo Unified', x: 769, y: 28.2791817087845},
            {name: 'Adelanto Elementary', x: 720, y: 61.0662080825451},
            {name: 'Alta Loma Elementary', x: 845, y: 39.0448261416003},
            {name: 'Barstow Unified', x: 751, y: 52.5288831835686},
            {name: 'Central Elementary', x: 821, y: 50.230282095567},
            {name: 'Rim of the World Unified', x: 744, y: 30.2966101694915},
            {name: 'Mountain View Elementary', x: 807, y: 72.9930624380574},
            {name: 'Bear Valley Unified', x: 735, y: 32.2407307898979},
            {name: 'Cucamonga Elementary', x: 782, y: 66.4084117321527},
            {name: 'Oro Grande Elementary', x: 774, y: 49.334945586457},
            {name: 'Silver Valley Unified', x: 805, y: 27.5382475660639},
            {name: 'Needles Unified', x: 666, y: 22.3570190641247},
            {name: 'Lucerne Valley Unified', x: 700, y: 42.9319371727748},
            {name: 'Helendale Elementary', x: 755, y: 29.1497975708502},
            {name: 'San Bernardino County Office of Education', x: 505, y: 55.0161812297734},
            {name: 'Trona Joint Unified', x: 782, y: 32.2033898305084},
            {name: 'Baker Valley Unified', x: 689, y: 85.0393700787401}
        ]}, {
        name: 'Ventura County',
        color: '#FF7F00',
        data: [
            {name: 'Conejo Valley Unified', x: 787, y: 22.2639068564036},
            {name: 'Simi Valley Unified', x: 767, y: 30.2760846181427},
            {name: 'Ventura Unified', x: 745, y: 47.6378868978356},
            {name: 'Oxnard', x: 717, y: 89.9808922488992},
            {name: 'Oxnard Union High', x: 716, y: 75.7525998905309},
            {name: 'Hueneme Elementary', x: 714, y: 84.9132850648257},
            {name: 'Moorpark Unified', x: 756, y: 41.0896028736779},
            {name: 'Pleasant Valley', x: 789, y: 29.570970328789},
            {name: 'Oak Park Unified', x: 888, y: 6.54897494305239},
            {name: 'Rio Elementary', x: 709, y: 84.7422062350119},
            {name: 'Fillmore Unified', x: 716, y: 89.0021849963583},
            {name: 'Santa Paula Elementary', x: 786, y: 94.9414873537183},
            {name: 'Ojai Unified', x: 736, y: 33.3656644034917},
            {name: 'Ocean View', x: 718, y: 88.076923076923},
            {name: 'Santa Paula Union High', x: 721, y: 93.7394247038917},
            {name: 'Mesa Union Elementary', x: 814, y: 54.5638945233265},
            {name: 'Briggs Elementary', x: 745, y: 86.3945578231292},
            {name: 'Somis Union', x: 791, y: 67.2131147540983},
            {name: 'Mupu Elementary', x: 816, y: 71.5686274509803}
        ]}
    ]

    // create an instance of the chart
    function createScatterPlot(containerToRenderTo, chartType, chartDataArray){

        console.log(dataArray[1]);

        var configChart = {};

        configChart.chart = {
            renderTo: containerToRenderTo,
            backgroundColor: '#ffffff',
            type: chartType,
            zoomType: 'xy',
        };

        configChart.title = {
            text: '',
            style: {
                display: 'none'
            }
        };

        configChart.subtitle = {
            text: '',
            style: {
                display: 'none'
            }
        };

        configChart.xAxis = [{
            min: 675,
            max: 925,
            tickInterval: 25,
            title: {
                enabled: true,
                text: 'District\'s 2013 API score',
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        }];

        configChart.yAxis = [{
            min: 0,
            max: 100,
            tickInterval: 10,
            title: {
                enabled: true,
                text: 'Percent of district students in Hispanic subgroup',
            },
        }];

        configChart.tooltip = {
            formatter: function(){
                if (this.series.name === 'API Threshold') {
                    return 'State goal of an API score of 800';
                } else if  (this.series.name === 'Trend') {
                    return false;
                } else {
                    return 'About <strong>' + Highcharts.numberFormat(this.y, 2, '.') + '%</strong> of students in<br />the <strong>' + this.point.name + '</strong><br />school district are in the <br />Hispanic subgroup, and<br />recorded a 2013 API score<br />of <strong>' + Highcharts.numberFormat(this.x, 0, '.') + '</strong>.';
                }
            },
            backgroundColor: '#020202',
            style: {
            	color: '#ffffff',
            	fontSize: '12px',
            	padding: '8px'
            },
            followPointer: true
        };

        configChart.legend = {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 0,
            floating: false,
            borderWidth: 1,
            backgroundColor: '#FFFFFF',
            shadow: true
        };

        configChart.plotOptions = {
            scatter: {
                marker: {
                    radius: 8,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },

            }
        };

        configChart.credits = {
            enabled: false,
            text: 'California Department of Education',
            href: 'http://www.cde.ca.gov/ta/ac/ap/'

        };

        configChart.series = chartDataArray;

        return configChart;

    };
    //end function